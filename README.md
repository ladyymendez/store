# Back-end Lady Mendez
## Deploy
Para ejecutar la aplicacion necesitas "URL_TOKEN", y "BODY_TOKEN" los cuales son proporcionados creando un proyecto en Auth0, puedes checar el proyecto en [producción](https://afternoon-dusk-31062.herokuapp.com/)

```
 URL_TOKEN="XXXXXX" BODY_TOKEN="XXXX" npm run start-dev
```

#### Ejecucion de pruebas

```
 NODE_ENV=test URL_TOKEN="XXXXXX" BODY_TOKEN="XXXX" grunt test
```

#### Ejecucion de covertura

```
 NODE_ENV=test URL_TOKEN="XXXXXX" BODY_TOKEN="XXXX" grunt coverage
```

## Token
Al momenento de logearse en la ruta `/login`, se obtiene un token el cual sirve para realizar las demas peticiones, las unicas rutas que no necesitan token son `/login` y `/register`.

##### Forma de enviar el token en el 

```
	-- 'authorization: Bearer XXXXXXX'
```

## Login
**Request:**

- POST /login

**Envias:**  Credenciales para logear.

```json
{
    "email": "xxx@xxx.xx",
    "password": "xxxxxx"
}
```

**Obtienes:**  Un `Token` y el id del usuario con los cuales puedes realizar diferentes peticiones.


**Successful Response::**

```json
{
    "access_token": "XXXX123",
    "expires_in": 86400,
    "token_type": "Bearer",
    "userid": "XXXXXXXXXXXX"
}
```

**Failed Response::**

```json
{
    "message": "Login Unsuccessful!"
}
```

## Register

**Request:**

- POST /register

**Envias:**  Datos para registrarse.

```json
{
	"name": "Laura",
    "email": "XXX@XXXX.XXX",
    "password": "XXXXXX"
}
```

**Obtienes:** Un mensaje de registro exitoso para logearse posteriormente

**Successful Response::**

```json
{
    "message": "Register Successful"
}
```

**Request:**

- PUT /users/:id

**Envias:**

- Header: Token
- Params: Id usuario a actualizar.
- Body: campo 'nombre' a actualizar.


```
	/users/XXXXXXXXXXXX
```

```json
{
	"name": "XXXXXX"
}
```
**Obtienes:**  Un mensaje de actualización exitosa

**Successful Response::**

```json
{
    "message": "Updated Successful"
}
```

**Request:**

- GET /users/:id

**Envias:**

- Header: Token
- Params: Id del usuario a consultar.

```
	/users/XXXXXXXXXXXX
```
**Obtienes:**  Información del registro

**Successful Response::**

```json
{
    "_id": "XXXXXXXXXXXX",
    "addresses": [],
    "cart": [],
    "createdAt": "2020-08-02T03:33:31.403Z",
    "email": "XXXXX@XXX.XX",
    "name": "XXXXXXXXX"
}
```

**Request:**

- DELETE /users/:id

**Envias:**

- Header: Token
- Params: Id del usuario a eliminar.

```
	/users/XXXXXXXXXXXX
```

**Obtienes:**  msj de operacion exitosa

**Successful Response::**

```json
{
    "message": "Deleted Successful"
}
```

## Items

**Request:**

- POST /items

**Envias:**

- Header: Token
- Body: Campos correspondientes para crear un item

```json
{
    "sellerId": "XXXXXX",
    "name": "XXXXXXXX",
    "price": 1000,
    "quantity": 10,
    "brand": "XXXXXX",
    "description": "XXXXX",
    "nameOfGame": "XXXXXXX",
    "imagen": "data:image/png;base64,..."
}
```
**sellerId:** Se refiere al id del usuario que esta creando los productos

**Obtienes:**  un json de el item creado

```json
{
    "sellerId": "XXXXXX",
    "name": "XXXXXXXX",
    "price": 1000,
    "quantity": 10,
    "brand": "XXXXXX",
    "description": "XXXXX",
    "nameOfGame": "XXXXXXX",
    "imagen": "XXXXX"
}
```

**Request:**

- GET /items/:id

**Envias:**

- Header: Token
- Params: id registro a consultar.

```
	/items/XXXXXXXXXXXX
```

**Obtienes:**  un objeto con los campos correspondientes del item que se consulto


```json
{
    "sellerId": "XXXXXX",
    "name": "XXXXXXXX",
    "price": 1000,
    "quantity": 10,
    "brand": "XXXXXX",
    "description": "XXXXX",
    "nameOfGame": "XXXXXXX",
    "imagen": "XXXXX"
}
```

- PUT /items/:id

**Envias:**

- Header: Token
- Params: id registro a actualizar.
- Body: campos que se desean actualizar

```json
{
    "sellerId": "XXXXXX",
    "name": "XXXXXXXX",
    "price": 1000,
    "quantity": 10,
    "brand": "XXXXXX",
    "description": "XXXXX",
    "nameOfGame": "XXXXXXX",
    "imagen": "data:image/png;base64,..."
}
```

**Obtienes:** un objeto del item con los campos actualizados

```json
{
    "sellerId": "XXXXXX",
    "name": "XXXXXXXX",
    "price": 1000,
    "quantity": 10,
    "brand": "XXXXXX",
    "description": "XXXXX",
    "nameOfGame": "XXXXXXX",
    "imagen": "XXXXXXXXX"
}
```

**Request:**

- DELETE /items/:id

**Envias:**

- Header: Token
- Params: id registro a eliminar.

```
	/items/XXXXXXXXXXXX
```

**Obtienes:**  msj de operacion exitosa

**Successful Response::**

```json
{
    "message": "Deleted Successful"
}
```

## Invantario
**Request:**

- GET /inventory/:id

**Envias:**

- Header: Token
- Params: id del usuario que deseas consultar sus productos creados.
- Query [optional]: sort=price, sort=-price , word=XXXX, sort=quantity, sort=-quantity.

word -> busca por palabras en el campo de description del item

```
	/inventory/XXXXXXXXXX?sort=price&word=xxx
```

**Obtienes:**  array de los items que se han creado por el usuario que se selecciono con sus respectivos filtros.

```json
[
    {
        "_id": "XXXXXXXXXXXX",
        "brand": "XXXXXXX",
        "createAt": "XXXXXXXX",
        "description": "XXXXXXXXX",
        "imagen": "http...",
        "name": "XXXXX",
        "nameOfGame": "XXXX",
        "price": 20,
        "quantity": 100,
        "sellerId": "XXXXXXXXXXXX"
    },
    {
        ...
    },
    ...
]

```

## Catalogo
**Request:**

- GET /catalog

**Envias:**

- Header: Token
- Query [optional]: sort=price, sort=-price , word=XXXX, sort=quantity, sort=-quantity.

**Obtienes:**  array de objetos de todos los items creados

```json
[
    {
        "_id": "XXXXXXXXXXXX",
        "brand": "XXXXXXX",
        "createAt": "XXXXXXXX",
        "description": "XXXXXXXXX",
        "imagen": "http...",
        "name": "XXXXX",
        "nameOfGame": "XXXX",
        "price": 20,
        "quantity": 100,
        "sellerId": "XXXXXXXXXXXX"
    },
    {
        ...
    },
    ...
]

```

## Carrito
**Request:**

- POST /cart

**Envias:**

- Header: Token
- Body: con los campos correspondientes para agregar el item al carrito

```json
{
    "userid": "XXXXXXXXXXXX",
    "itemid": "XXXXXXX",
    "quantity": "XXXXXXXX"
}

```
**Obtienes:**  Un objeto con clave shoppingCart que regresa el item agregado

```json
[
    {
        "_id": "XXXXXXXXXXXX",
        "shoppingCart": [
            {
                "idItem": "XXXXXXXXXXXX",
                "name": "XXXXXXXXXXXX",
                "price": 20,
                "quantity": 12,
                "quantityItem": 100,
                "sellerId": "XXXXXXXXXXXX"
            }
        ]
    }
]
```

**Request:**

- GET /cart/:userid

**Envias:**

- Header: Token
- Params: id del usuario que deseamos consultar su carrito

```
	/cart/XXXXXXXXXX
```

**Obtienes:**  array de objetos con clave shoppingCart de los items que se han anexado al carrito el usuario
```json
[
    {
        "_id": "XXXXXXXXXXXX",
        "shoppingCart": [
            {
                "idItem": "XXXXXXXXXXXX",
                "name": "XXXXXXXXXXXX",
                "price": 20,
                "quantity": 12,
                "quantityItem": 100,
                "sellerId": "XXXXXXXXXXXX"
            },
            {...},
            ...
        ]
    }
]
```

**Request:**

- PUT /cart/:userid

**Envias:**

- Header: Token
- Params: Id del usuario a actualizar su carrito
- Body: con los campos correspondientes a actualizar

```
	/cart/XXXXXXXXXX
```

```json
{
    "itemid": "XXXXXXXXXXXX",
    "quantity": "XXXXXXXX"
}

```

**Obtienes:**  Un objeto con una clave shoppingCart que regresa el item actualizado

```json
[
    {
        "_id": "XXXXXXXXXXXX",
        "shoppingCart": [
            {
                "idItem": "XXXXXXXXXXXX",
                "name": "XXXXXXXXXXXX",
                "price": 20,
                "quantity": 12,
                "quantityItem": 100,
                "sellerId": "XXXXXXXXXXXX"
            }
        ]
    }
]
```

**Request:**

- DELETE /cart/:userid

**Envias:**

- Header: Token
- Params: Id del usuario que eliminara un producto de su carrito
- Body: id del item a eliminar

```
	/cart/XXXXXXXXXX
```

```json
{
    "itemid": "XXXXXXXXXXXX"
}

```

**Obtienes:**  mensaje de eliminacion exitosa

## Orden

**Request:**

- POST /orders/

**Envias:**

- Header: Token
- Body: id del usuario


```json
{
    "userid": "XXXXXXXXXXXX"
}

```

**Obtienes:**  un objeto con los campos que se creo la orden

```json
{
  "items": [
    {
      "idItem": "xxxxxxx",
      "idSeller": "xxxxxxx",
      "name": "xxxxxxx",
      "price": 0,
      "qty": 0
    }
  ],
  "paymentMethod": "xxxxxxx",
  "_id": "xxxxxxx",
  "userId": "xxxxxxx",
  "createdAt": "xxxxxxx",
  "grandTotal": 0

}

```

## History

**Request:**

- GET /history/shopping/:userid

**Envias:**

- Header: Token
- params: id del usuario que se consultaran sus compras

```
	/history/shopping/XXXXXXXXXX
```

**Obtienes:**  un array de objetos de las ordenes que se han creado

```json
[
    {
        "_id": "XXXXXXXXX",
        "createdAt": "XXXXXX",
        "grandTotal": 3000,
        "items": [
            {
                "idItem": "XXXXXXX",
                "idSeller": "XXXXXXXXX",
                "name": "XXXXXXXXX",
                "price": 500,
                "qty": 6
            }
        ],
        "paymentMethod": "\"Pago contra entrega\"",
        "userId": "XXXXXXXXXXXX"
    }
]

```

**Request:**

- GET /history/sales/:userid

**Envias:**

- Header: Token
- params: id del usuario que se desea saber sus ventas

```
	/history/sales/XXXXXXXXXX
```

**Obtienes:**  un array de objetos de las ordenes de venta

```json
[
    {
        "_id": "XXXXXXXXXXXXX",
        "buyer": [
            {
                "_id": "XXXXXXXXXXX",
                "name": "xxxxxxx"
            }
        ],
        "sold": [
            {
                "idItem": "XXXXXXXXXXX",
                "idSeller": "XXXXXXXXXXX",
                "name": "XXXXXXXXXXX",
                "price": "XXXXXXXX",
                "qty": "XXXXXXXXXXX"
            }
        ]
    }
]
```

## Failed Responses 404-500

**Failed Response: 404**

Si el id de usuario es incorrecto

Peticiones:

- DELETE /users/:id
- GET /users/:id
- PUT /users/:id
- GET /items/:id
- PUT /items/:id
- DELETE /items/:id
- GET /inventory/:id
- GET /cart/:id
- POST /orders/

```json
{
    "message": "Resource not found"
}
```

**Failed Response: 500**

Cuando los campos sean requeridos

Peticiones:

- POST /login
- POST /register
- PUT /users/:id
- POST /items
- PUT /items
- POST /cart
- PUT /cart/:id
- DELETE /cart/:id
- POST /orders/

```json
{
    "message": "\"xxxxx\" is required"
}
```
