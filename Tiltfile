docker_compose("./docker-compose.yml")
docker_build('api', './', live_update = [
  sync('.', '/app'),
  run('npm i', trigger='package.json'),
  restart_container()
])
