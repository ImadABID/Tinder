# sudo systemctl start mongod.service

printf "\n reseting db : ";
curl -X POST -d 'username=lora' -d 'email=lora17@yml.fr' -d 'password=kona75mi:-)' http://localhost:3000/users/register;
curl -X GET http://localhost:3000/drop_db;

printf "\n adding lora : "
curl -X POST -d 'username=lora' -d 'email=lora17@yml.fr' -d 'password=kona75mi:-)' http://localhost:3000/users/register;

printf "\n correct authentication to lora : "
curl -X POST -d 'email=lora17@yml.fr' -d 'password=kona75mi:-)' http://localhost:3000/users/is_registered

printf "\n false authentication to lora : "
curl -X POST -d 'email=lora17@yml.fr' -d 'password=koZa75mi:-)' http://localhost:3000/users/is_registered

printf "\n"