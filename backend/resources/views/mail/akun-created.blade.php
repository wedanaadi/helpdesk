<!DOCTYPE html>
<html>
<head>
    <title>Helpdesk</title>
</head>
<body>
    <h3>{{ $data['message'] }}</h3>
    <br/>
    <h5>Silakan Kunjungi link: {{ $data['public_url'] }} ,dengan menginputkan :</h5>
    <p>Username: {{ $data['username'] }}</p>
    <p>Password: {{ $data['password'] }}</p>

    <p>Terimakasih</p>
</body>
</html>
