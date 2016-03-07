var http = require('http');
var socketio = require( 'socket.io' ); // Socket.IOモジュール読み込み
var fs = require( 'fs' ); // ファイル入出力モジュール読み込み
//Lets define a port we want to listen to
var port = process.env.PORT || 1337;
var ip = "0.0.0.0";

/*http.createServer(function(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
	if(req.url.match(/ip/)){
		ip = req.url;
		res.end('It Works!! IP: ' + ip);	
	}else{
	//	res.end('It Works!! Path Hit: ' + req.url);
		res.end('It Works!! IP: ' + ip);
	}


}).listen(port);
*/


// 3000番ポートでHTTPサーバーを立てる
var server = http.createServer( function( req, res ) {
    res.writeHead(200, { 'Content-Type' : 'text/html' }); // ヘッダ出力
    res.end( fs.readFileSync('./index.html', 'utf-8') );  // index.htmlの内容を出力
}).listen(port);

// サーバーをソケットに紐付ける
var io = socketio.listen( server );

// 接続確立後の通信処理部分を定義
io.sockets.on( 'connection', function( socket ) {

    // クライアントからサーバーへ メッセージ送信ハンドラ（自分を含む全員宛に送る）
    socket.on( 'c2s_message', function( data ) {
        // サーバーからクライアントへ メッセージを送り返し
        io.sockets.emit( 's2c_message', { value : data.value } );
    });

    // クライアントからサーバーへ メッセージ送信ハンドラ（自分以外の全員宛に送る）
    socket.on( 'c2s_broadcast', function( data ) {
        // サーバーからクライアントへ メッセージを送り返し
        socket.broadcast.emit( 's2c_message', { value : data.value } );
    });
});