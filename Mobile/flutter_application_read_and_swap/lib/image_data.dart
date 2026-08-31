import 'dart:convert';
import 'dart:typed_data';

import 'package:flutter/material.dart';

Uint8List? decodeImageData(String? value) {
  if (value == null || value.trim().isEmpty) return null;
  final data = value.trim();
  final encoded = data.startsWith('data:')
      ? data.substring(data.indexOf(',') + 1)
      : data;
  try {
    return base64Decode(encoded);
  } on FormatException {
    return null;
  }
}

ImageProvider? imageProviderFromData(String? value) {
  final bytes = decodeImageData(value);
  return bytes == null ? null : MemoryImage(bytes);
}

String imageDataUri(Uint8List bytes, {String mimeType = 'image/jpeg'}) =>
    'data:$mimeType;base64,${base64Encode(bytes)}';
