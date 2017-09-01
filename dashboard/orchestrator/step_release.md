cd Sites/orchestrator/
npm run build
cd build
tar cvf ../build.tar *
cd ..
sftp root@192.168.129.151
(pass: root)
cd /www/pages
put build.tar
exit from sftp
ssh root@192.168.129.151
(pass: root)
cd /www/pages
tar xvf build.tar

