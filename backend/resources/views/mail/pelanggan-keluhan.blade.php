<!DOCTYPE html>
<html>
<head>
    <title>Helpdesk</title>
</head>
<body>
    <h3>Nomor Ticket: {{ $data['nomor'] }}</h3>
    <h6>Kategori Keluhan: {{ $data['kategori'] }}</h6>
    <p style="white-space:pre-line">{{ $data['message'][0] }}</p>
    @if (count($data['message'])>1)
    <p>Hasil Update/Note: </p>
    <p style="white-space:pre-line"><strong>{{ $data['message'][1] }}</strong></p>
    @endif
    <p>Terimakasih</p>
</body>
</html>
