process.env.NODE_ENV = 'production';

var chalk = require('chalk');
var exec = require('child_process').exec;
var Client = require('ssh2').Client;
var conn = new Client();

var sshConf;
if (process.argv[2] == 'release'){
		sshConf = {
		host: '52.168.167.128',
		port: 22,
		username: 'uniquid_user',
		privateKey: require('fs').readFileSync(process.env.HOME + '/.ssh/id_rsa'),
		path: '/home/uniquid_user/orchestrator/'
		};
} else {
	sshConf = {
		host: '0.0.0.0',
		port: 22,
		username: 'uniquid_user',
		privateKey: require('fs').readFileSync(process.env.HOME + '/.ssh/id_rsa'),
		path: '/home/uniquid_user/orchestrator/'
		};
}
function remoteMove(conf, connection) {
	console.log(chalk.yellow('Moving files from 🏠  to Nginx directory...'));
	connection.exec('sudo rm -r /var/www/html/* && sudo cp -r ~/orchestrator/* /var/www/html', function(err, stream) {
		if (err) throw err;
		stream.on('close', function(code, signal) {
			connection.end();
			console.log(chalk.green('👌  All right sparkly'));
		}).on('data', function(data) {
			console.log('STDOUT: ' + data);
		});
	});
}

function copyFiles(conf, connection) {
	console.log(chalk.yellow('Copying files to remote server... 🖥️'));

	exec('scp -r build/* ' + conf.username + '@' + conf.host + ':' + conf.path, function(err, stdout, stderr) {
		if (err) {
			console.log(chalk.red('Error!'));
			connection.end();
			throw err;
		}
		console.log(chalk.green('👌  Copy ok\n'));
		remoteMove(conf, connection);
	});
}

conn.on('ready', function() {
	console.log(chalk.green('Deploying 👌\n'));

	conn.exec('rm -r ~/orchestrator/*', function(err, stream) {
		if (err) throw err;
		stream.on('close', function(code, signal) {
			copyFiles(sshConf, conn);
		}).on('data', function(data) {
			console.log('STDOUT: ' + data);
		}).stderr.on('data', function(data) {
			console.log('STDERR: ' + data);
		});
	});
}).connect(sshConf);
