<!DOCTYPE html>
<html>
<head>
    <title>Helpdesk</title>
</head>
<body>
    <h3>Nomor Ticket: {{ $data['nomor'] }}</h3>
    <h6>Kategori Keluhan: {{ $data['kategori'] }}</h6>
    <p style="white-space:pre-line">{{ $data['message'] }}</p>
    <p>Terimakasih</p>
</body>
</html>
