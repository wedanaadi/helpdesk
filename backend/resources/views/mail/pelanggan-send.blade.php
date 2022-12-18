<!DOCTYPE html>
<html>
<head>
    <title>Helpdesk</title>
</head>
<body>
    <h3>Nomor Ticket: {{ $data['ticket_keluhan'] }}</h3>
    <h5>Pesan :</h5>
    <p style="white-space:pre-line">Tiket Maintenance berhasil dibuat {{ $data['ticket_maintenance'] }}</p>
    <p style="white-space:pre-line">Teknisi yang bertugas {{ $data['teknisi_nama'] }}</p>
    <p>Terimakasih</p>
</body>
</html>
