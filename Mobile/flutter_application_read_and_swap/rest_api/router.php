<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Authorization, Content-Type');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

function out(mixed $data, int $status = 200): never {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}
function body(): array {
    $data = json_decode(file_get_contents('php://input') ?: '{}', true);
    return is_array($data) ? $data : [];
}
function imageUri(?string $blob): string { return $blob ? 'data:image/jpeg;base64,' . base64_encode($blob) : ''; }
function imageBlob(mixed $value): ?string {
    if ($value === null || $value === '') return null;
    if (!is_string($value)) out(['erro'=>'Imagem inválida.'],422);
    $encoded=preg_replace('#^data:image/[a-zA-Z0-9.+-]+;base64,#','',$value);
    $blob=base64_decode($encoded,true);
    if($blob===false||strlen($blob)>8*1024*1024) out(['erro'=>'Imagem inválida ou maior que 8 MB.'],422);
    return $blob;
}

try {
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
    $sharedConfigPath = dirname(__DIR__, 3) . '/Web/Projeto Integrador HTML/backend/includes/config.local.php';
    $local = is_file($sharedConfigPath) ? require $sharedConfigPath : [];
    $db = new mysqli(
        getenv('READSWAP_DB_HOST') ?: ($local['host'] ?? '127.0.0.1'),
        getenv('READSWAP_DB_USER') ?: ($local['user'] ?? 'root'),
        getenv('READSWAP_DB_PASSWORD') ?: ($local['password'] ?? ''),
        getenv('READSWAP_DB_NAME') ?: ($local['database'] ?? 'ReadSwap'),
        (int)(getenv('READSWAP_DB_PORT') ?: ($local['port'] ?? 3306))
    );
    $db->set_charset('utf8mb4');
    $db->query("CREATE TABLE IF NOT EXISTS ApiTokens (
        id INT AUTO_INCREMENT PRIMARY KEY, usuario_id INT NOT NULL, token_hash CHAR(64) NOT NULL UNIQUE,
        expira_em DATETIME NOT NULL, criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX(usuario_id), FOREIGN KEY(usuario_id) REFERENCES PerfisADMs(idPerfis) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
} catch (Throwable $e) { error_log($e->getMessage()); out(['erro' => 'Banco de dados indisponível.'], 503); }

$path = trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?? '', '/');
$method = $_SERVER['REQUEST_METHOD'];

function userId(mysqli $db): int {
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (!preg_match('/^Bearer\s+(.+)$/i', $header, $m)) out(['erro' => 'Token ausente.'], 401);
    $hash = hash('sha256', $m[1]);
    $stmt = $db->prepare('SELECT usuario_id FROM ApiTokens WHERE token_hash=? AND expira_em>NOW() LIMIT 1');
    $stmt->bind_param('s', $hash); $stmt->execute();
    $row = $stmt->get_result()->fetch_assoc();
    if (!$row) out(['erro' => 'Token inválido ou expirado.'], 401);
    return (int)$row['usuario_id'];
}
function profile(mysqli $db, int $id): array {
    $stmt=$db->prepare('SELECT idPerfis,Nome,Email,Cidade,Generos,Foto,Premium,Status FROM PerfisADMs WHERE idPerfis=? AND Status=0');
    $stmt->bind_param('i',$id); $stmt->execute(); $u=$stmt->get_result()->fetch_assoc();
    if(!$u) out(['erro'=>'Usuário não encontrado.'],404);
    return ['id'=>(int)$u['idPerfis'],'nome'=>$u['Nome'],'email'=>$u['Email'],'cidade'=>$u['Cidade']??'',
      'generos'=>json_decode($u['Generos']?:'[]',true)?:[],'foto'=>imageUri($u['Foto']),'premium'=>(bool)$u['Premium']];
}

if ($path === 'health' && $method === 'GET') out(['status'=>'ok']);

if ($path === 'auth/register' && $method === 'POST') {
    $d=body(); $nome=trim((string)($d['nome']??'')); $email=strtolower(trim((string)($d['email']??''))); $senha=(string)($d['senha']??'');
    if(strlen($nome)<3 || !filter_var($email,FILTER_VALIDATE_EMAIL) || strlen($senha)<8) out(['erro'=>'Nome, e-mail ou senha inválidos.'],422);
    $check=$db->prepare('SELECT 1 FROM PerfisADMs WHERE Email=?'); $check->bind_param('s',$email); $check->execute();
    if($check->get_result()->fetch_row()) out(['erro'=>'Este e-mail já está cadastrado.'],409);
    $hash=password_hash($senha,PASSWORD_DEFAULT); $stmt=$db->prepare('INSERT INTO PerfisADMs(Nome,Email,Status,Senha,Premium) VALUES(?,?,0,?,0)');
    $stmt->bind_param('sss',$nome,$email,$hash); $stmt->execute();
    $d=['email'=>$email,'senha'=>$senha]; $path='auth/login';
}
if ($path === 'auth/login' && $method === 'POST') {
    $d=$d??body(); $email=strtolower(trim((string)($d['email']??''))); $senha=(string)($d['senha']??'');
    $stmt=$db->prepare('SELECT idPerfis,Senha,Status FROM PerfisADMs WHERE Email=? LIMIT 1'); $stmt->bind_param('s',$email); $stmt->execute(); $u=$stmt->get_result()->fetch_assoc();
    if(!$u || (int)$u['Status']!==0 || !password_verify($senha,$u['Senha'])) out(['erro'=>'E-mail ou senha incorretos.'],401);
    $token=bin2hex(random_bytes(32)); $tokenHash=hash('sha256',$token); $id=(int)$u['idPerfis'];
    $stmt=$db->prepare('INSERT INTO ApiTokens(usuario_id,token_hash,expira_em) VALUES(?,?,DATE_ADD(NOW(),INTERVAL 30 DAY))'); $stmt->bind_param('is',$id,$tokenHash); $stmt->execute();
    out(['token'=>$token,'usuario'=>profile($db,$id)]);
}
if ($path === 'auth/logout' && $method === 'POST') {
    userId($db); $header=$_SERVER['HTTP_AUTHORIZATION']; preg_match('/^Bearer\s+(.+)$/i',$header,$m); $hash=hash('sha256',$m[1]);
    $stmt=$db->prepare('DELETE FROM ApiTokens WHERE token_hash=?'); $stmt->bind_param('s',$hash); $stmt->execute(); out(['sucesso'=>true]);
}

$uid=userId($db);
if ($path === 'me' && $method === 'GET') out(profile($db,$uid));
if ($path === 'me' && $method === 'PUT') {
    $d=body(); $nome=trim((string)($d['nome']??'')); $cidade=trim((string)($d['cidade']??'')); $generos=json_encode(array_values($d['generos']??[]),JSON_UNESCAPED_UNICODE);
    if(strlen($nome)<2 || strlen($cidade)>120) out(['erro'=>'Perfil inválido.'],422);
    if(array_key_exists('foto',$d)){$foto=imageBlob($d['foto']);$stmt=$db->prepare('UPDATE PerfisADMs SET Nome=?,Cidade=?,Generos=?,Foto=? WHERE idPerfis=?');$stmt->bind_param('ssssi',$nome,$cidade,$generos,$foto,$uid);}
    else{$stmt=$db->prepare('UPDATE PerfisADMs SET Nome=?,Cidade=?,Generos=? WHERE idPerfis=?');$stmt->bind_param('sssi',$nome,$cidade,$generos,$uid);}
    $stmt->execute(); out(profile($db,$uid));
}
if ($path === 'books' && $method === 'GET') {
    $stmt=$db->prepare('SELECT idLivrosADMs,Nome,Autor,Editora,AnoPublicacao,Genero,EstadoConservacao,Observacoes,Fotolivro,Status FROM LivrosADMs WHERE IdDono=? ORDER BY idLivrosADMs DESC'); $stmt->bind_param('i',$uid); $stmt->execute(); $items=[];
    foreach($stmt->get_result() as $r) $items[]=['id'=>(int)$r['idLivrosADMs'],'nome'=>$r['Nome'],'autor'=>$r['Autor'],'editora'=>$r['Editora'],'ano'=>$r['AnoPublicacao'],'genero'=>$r['Genero'],'estado'=>$r['EstadoConservacao'],'observacoes'=>$r['Observacoes'],'foto'=>imageUri($r['Fotolivro']),'trocado'=>(bool)$r['Status']]; out($items);
}
if ($path === 'books' && $method === 'POST') {
    $d=body();$nome=trim((string)($d['nome']??''));$autor=trim((string)($d['autor']??''));$editora=trim((string)($d['editora']??''));$ano=(int)($d['ano']??0);$genero=trim((string)($d['genero']??''));$estado=trim((string)($d['estado']??''));$obs=trim((string)($d['observacoes']??''));$foto=imageBlob($d['foto']??null);
    if($nome===''||$autor===''||$editora===''||$ano<1||$genero===''||$estado==='') out(['erro'=>'Dados do livro inválidos.'],422);
    $stmt=$db->prepare('INSERT INTO LivrosADMs(Nome,Autor,Editora,AnoPublicacao,Genero,EstadoConservacao,Observacoes,Fotolivro,IdDono,Status) VALUES(?,?,?,?,?,?,?,?,?,0)');$stmt->bind_param('sssissssi',$nome,$autor,$editora,$ano,$genero,$estado,$obs,$foto,$uid);$stmt->execute();out(['id'=>$stmt->insert_id],201);
}
if (preg_match('#^books/(\d+)$#',$path,$m) && $method === 'PUT') {
    $id=(int)$m[1];$d=body();$nome=trim((string)($d['nome']??''));$autor=trim((string)($d['autor']??''));$editora=trim((string)($d['editora']??''));$ano=(int)($d['ano']??0);$genero=trim((string)($d['genero']??''));$estado=trim((string)($d['estado']??''));$obs=trim((string)($d['observacoes']??''));
    if($nome===''||$autor===''||$editora===''||$ano<1||$genero===''||$estado==='') out(['erro'=>'Dados do livro inválidos.'],422);
    if(array_key_exists('foto',$d)){$foto=imageBlob($d['foto']);$stmt=$db->prepare('UPDATE LivrosADMs SET Nome=?,Autor=?,Editora=?,AnoPublicacao=?,Genero=?,EstadoConservacao=?,Observacoes=?,Fotolivro=? WHERE idLivrosADMs=? AND IdDono=?');$stmt->bind_param('sssissssii',$nome,$autor,$editora,$ano,$genero,$estado,$obs,$foto,$id,$uid);}
    else{$stmt=$db->prepare('UPDATE LivrosADMs SET Nome=?,Autor=?,Editora=?,AnoPublicacao=?,Genero=?,EstadoConservacao=?,Observacoes=? WHERE idLivrosADMs=? AND IdDono=?');$stmt->bind_param('sssisssii',$nome,$autor,$editora,$ano,$genero,$estado,$obs,$id,$uid);}
    $stmt->execute();if(!$stmt->affected_rows){$check=$db->prepare('SELECT 1 FROM LivrosADMs WHERE idLivrosADMs=? AND IdDono=?');$check->bind_param('ii',$id,$uid);$check->execute();if(!$check->get_result()->fetch_row())out(['erro'=>'Livro não encontrado.'],404);}out(['id'=>$id]);
}
if (preg_match('#^books/(\d+)$#',$path,$m) && $method === 'DELETE') {
    $id=(int)$m[1]; $stmt=$db->prepare('DELETE FROM LivrosADMs WHERE idLivrosADMs=? AND IdDono=?'); $stmt->bind_param('ii',$id,$uid); $stmt->execute(); if(!$stmt->affected_rows) out(['erro'=>'Livro não encontrado.'],404); out(null,204);
}
if ($path === 'swaps' && $method === 'GET') {
    $stmt=$db->prepare('SELECT l.idLivrosADMs,l.Nome,l.Autor,l.Editora,l.AnoPublicacao,l.Genero,l.EstadoConservacao,l.Observacoes,l.Fotolivro,p.idPerfis idDono,p.Nome dono,p.Cidade FROM LivrosADMs l JOIN PerfisADMs p ON p.idPerfis=l.IdDono WHERE l.IdDono<>? AND l.Status=0 AND p.Status=0 AND NOT EXISTS(SELECT 1 FROM SwapsADMs s WHERE s.idUsuario=? AND s.idLivro=l.idLivrosADMs) ORDER BY l.idLivrosADMs DESC'); $stmt->bind_param('ii',$uid,$uid); $stmt->execute(); $items=[];
    foreach($stmt->get_result() as $r) $items[]=['id'=>(int)$r['idLivrosADMs'],'titulo'=>$r['Nome'],'autor'=>$r['Autor'],'editora'=>$r['Editora'],'ano'=>$r['AnoPublicacao'],'generos'=>array_values(array_filter(array_map('trim',explode(',',$r['Genero'])))),'estado'=>$r['EstadoConservacao'],'observacoes'=>$r['Observacoes'],'img'=>imageUri($r['Fotolivro']),'idDono'=>(int)$r['idDono'],'dono'=>$r['dono'],'cidade'=>$r['Cidade']??'']; out($items);
}
if ($path === 'swaps' && $method === 'POST') {
    $d=body(); $livro=(int)($d['livro_id']??0); $gostou=filter_var($d['gostou']??null,FILTER_VALIDATE_BOOL,FILTER_NULL_ON_FAILURE); if(!$livro||$gostou===null) out(['erro'=>'Avaliação inválida.'],422);
    $stmt=$db->prepare('SELECT IdDono FROM LivrosADMs WHERE idLivrosADMs=? AND IdDono<>? AND Status=0'); $stmt->bind_param('ii',$livro,$uid); $stmt->execute(); $l=$stmt->get_result()->fetch_assoc(); if(!$l) out(['erro'=>'Livro indisponível.'],404);
    $g=$gostou?1:0; $stmt=$db->prepare('INSERT INTO SwapsADMs(idUsuario,idLivro,Gostou) VALUES(?,?,?) ON DUPLICATE KEY UPDATE Gostou=VALUES(Gostou),DataAvaliacao=NOW()'); $stmt->bind_param('iii',$uid,$livro,$g); $stmt->execute(); $match=false;
    if($g){$dono=(int)$l['IdDono'];$q=$db->prepare('SELECT 1 FROM SwapsADMs s JOIN LivrosADMs l ON l.idLivrosADMs=s.idLivro WHERE s.idUsuario=? AND l.IdDono=? AND s.Gostou=1 LIMIT 1');$q->bind_param('ii',$dono,$uid);$q->execute();$match=(bool)$q->get_result()->fetch_row();} out(['sucesso'=>true,'match'=>$match]);
}
if ($path === 'matches' && $method === 'GET') {
    $stmt=$db->prepare("SELECT p.idPerfis,p.Nome,p.Foto,c.conteudo,c.DataEnvio FROM PerfisADMs p JOIN (SELECT DISTINCT l.IdDono contato FROM SwapsADMs s JOIN LivrosADMs l ON l.idLivrosADMs=s.idLivro WHERE s.idUsuario=? AND s.Gostou=1 AND EXISTS(SELECT 1 FROM SwapsADMs r JOIN LivrosADMs lr ON lr.idLivrosADMs=r.idLivro WHERE r.idUsuario=l.IdDono AND lr.IdDono=? AND r.Gostou=1)) x ON x.contato=p.idPerfis LEFT JOIN conversasADMs c ON c.id1=LEAST(?,p.idPerfis) AND c.id2=GREATEST(?,p.idPerfis) AND c.Statuscvs=0 ORDER BY c.DataEnvio DESC,p.Nome"); $stmt->bind_param('iiii',$uid,$uid,$uid,$uid); $stmt->execute(); $items=[];
    foreach($stmt->get_result() as $r){$msgs=json_decode($r['conteudo']??'[]',true)?:[];$last=$msgs?end($msgs):[];$items[]=['id'=>(int)$r['idPerfis'],'nome'=>$r['Nome'],'foto'=>imageUri($r['Foto']),'ultimaMensagem'=>$last['texto']??'','ultimaData'=>$last['data']??($r['DataEnvio']??'')];} out($items);
}
if (preg_match('#^conversations/(\d+)$#',$path,$m) && ($method === 'GET' || $method === 'POST')) {
    $contato=(int)$m[1];
    if($contato===$uid) out(['erro'=>'Contato inválido.'],422);
    $match=$db->prepare('SELECT 1 FROM SwapsADMs s JOIN LivrosADMs l ON l.idLivrosADMs=s.idLivro WHERE s.idUsuario=? AND l.IdDono=? AND s.Gostou=1 AND EXISTS(SELECT 1 FROM SwapsADMs r JOIN LivrosADMs lr ON lr.idLivrosADMs=r.idLivro WHERE r.idUsuario=? AND lr.IdDono=? AND r.Gostou=1) LIMIT 1');
    $match->bind_param('iiii',$uid,$contato,$contato,$uid);$match->execute();
    if(!$match->get_result()->fetch_row()) out(['erro'=>'Esta conversa não está disponível.'],403);
    $id1=min($uid,$contato);$id2=max($uid,$contato);
    $stmt=$db->prepare('SELECT conteudo FROM conversasADMs WHERE id1=? AND id2=? AND Statuscvs=0 LIMIT 1');
    $stmt->bind_param('ii',$id1,$id2);$stmt->execute();$row=$stmt->get_result()->fetch_assoc();
    $mensagens=$row?(json_decode($row['conteudo']?:'[]',true)?:[]):[];
    if($method==='GET') out(array_values($mensagens));
    $d=body();$texto=trim((string)($d['texto']??''));
    $tamanho=function_exists('mb_strlen')?mb_strlen($texto):strlen($texto);
    if($texto===''||$tamanho>2000) out(['erro'=>'A mensagem deve ter entre 1 e 2000 caracteres.'],422);
    $mensagem=['remetente'=>$uid,'texto'=>$texto,'data'=>gmdate('c')];$mensagens[]=$mensagem;
    $conteudo=json_encode(array_values($mensagens),JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES);
    if($row){$save=$db->prepare('UPDATE conversasADMs SET conteudo=?,DataEnvio=NOW() WHERE id1=? AND id2=? AND Statuscvs=0');$save->bind_param('sii',$conteudo,$id1,$id2);}
    else{$save=$db->prepare('INSERT INTO conversasADMs(id1,id2,conteudo,DataEnvio,Statuscvs) VALUES(?,?,?,NOW(),0)');$save->bind_param('iis',$id1,$id2,$conteudo);}
    $save->execute();out($mensagem,201);
}
out(['erro'=>'Rota não encontrada.'],404);
