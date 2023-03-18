<!DOCTYPE html>
<html>
<head>
    <title>Helpdesk</title>
</head>
<body>
    <h3>{{ $data['message'] }}</h3>
    <br/>
    <h5>Silakan Kunjungi: <a href={{ $data['public_url'] }} target="_blank" rel="noopener noreferrer">link</a> ,dengan menginputkan :</h5>
    <p>Username: {{ $data['username'] }}</p>
    <p>Password: {{ $data['password'] }}</p>

    <p>Terimakasih</p>
</body>
</html>
