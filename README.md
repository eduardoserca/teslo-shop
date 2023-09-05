# Next.js Teslo Shop
Para correr localmente, se necesita la base de datos
```
docker-compose up -d
```

* El -d, significa _detached_

## Configurar las variables de entorno
Renombrar el archivo __.env.template__ as __.env__

* Mongo URL Local:
```
mongodb://localhost:27017/teslodb
```


* Reconstruir los módulos de node y levantar Next
```
npm install
npm dev
```

## Llenar la base de datos con información de pruebas
Llamara:
```
mongodb://localhost:3000/api/seed
```