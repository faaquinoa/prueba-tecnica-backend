## PRUEBA TÉCNICA - BACKEND GATEWAY POS

Este proyecto contiene 02 servicios lambda **crear token** y **consultar token** según el requerimiento técnico solicitado.

_Nota: este proyecto esta basado en las especificaciones solicitadas en el documento de prueba técnica_

#### Requisitos Técnicos

- NodeJS v18.12.1
- 7z
- Git Bash
- MongoDB v4.5 o mayor
- Cuenta en AWS

#### Comandos

**npm run build**: Este comando debe ser ejecutado desde la consola de _Git Bash_, el cual ejecuta el script _setup.sh_ que se encuentra en la carpeta _script_ con lo que se genera los archivos _.zip_ para ser utilizados como _Lambda_ en _AWS_.

**npm run test**: Este comando debe ser ejecutado desde la consola de _Git Bash_, el cual permite ejecutar las pruebas configuradas en la carpeta _src_ que poseen la extensión _.spec.ts_ donde se han configurados diferentes casos con las validaciones solicitadas.

_Nota: en el caso del test de tokenConsult se deberá modificar el token de la línea 48 por un token válido registrado en la base de datos no relacional_

#### Configuración

- Se deberá crear una función Lambda con nombre _tokenConsult_ y se deberá cargar el código desde el archivo _tokenConsult.zip_.
- Se deberá crear una función Lambda con nombre _tokenCreate_ y se deberá cargar el código desde el archivo _tokenCreate.zip_.
- Se deberá crear un _API Gateway_ como _API REST_ para desencadenar el uso de las funciones lambda.
- En el _API Gateway_ generado, se deberá generar un recurso con el nombre **api**.
- En el recurso **/api**, se deberá generar otro recurso con el nombre **token**.
- En el recurso **/api/token**, se deberá generar otro recurso con el nombre **consult**.
- En el recurso **/api/token/consult**, se deberá generar un método de tipo **POST** y utilizar la función Lambda **tokenConsult**.
- En el método **POST /api/token/consult** en el apartado **Solicitud de método**, se deberá solicitar la cabecera _Authorization_ como obligatorio.
- En el método **POST /api/token/consult** en el apartado **Solicitud de integración**, se deberá modificar la plantilla de mapeo en _Content-Type_ **text/plain** completar con el siguiente código:

```
#set($allParams = $input.params())
{
"body" : $input.body,
"headers": {
    #foreach($param in $input.params().header.keySet())
    "$param": "$util.escapeJavaScript($input.params().header.get($param))"
    #if($foreach.hasNext),#end
    #end
  },
"params" : {
#foreach($type in $allParams.keySet())
    #set($params = $allParams.get($type))
"$type" : {
    #foreach($paramName in $params.keySet())
    "$paramName" : "$util.escapeJavaScript($params.get($paramName))"
        #if($foreach.hasNext),#end
    #end
}
    #if($foreach.hasNext),#end
#end
},
"stage-variables" : {
#foreach($key in $stageVariables.keySet())
"$key" : "$util.escapeJavaScript($stageVariables.get($key))"
    #if($foreach.hasNext),#end
#end
},
"context" : {
    "account-id" : "$context.identity.accountId",
    "api-id" : "$context.apiId",
    "api-key" : "$context.identity.apiKey",
    "authorizer-principal-id" : "$context.authorizer.principalId",
    "caller" : "$context.identity.caller",
    "cognito-authentication-provider" : "$context.identity.cognitoAuthenticationProvider",
    "cognito-authentication-type" : "$context.identity.cognitoAuthenticationType",
    "cognito-identity-id" : "$context.identity.cognitoIdentityId",
    "cognito-identity-pool-id" : "$context.identity.cognitoIdentityPoolId",
    "http-method" : "$context.httpMethod",
    "stage" : "$context.stage",
    "source-ip" : "$context.identity.sourceIp",
    "user" : "$context.identity.user",
    "user-agent" : "$context.identity.userAgent",
    "user-arn" : "$context.identity.userArn",
    "request-id" : "$context.requestId",
    "resource-id" : "$context.resourceId",
    "resource-path" : "$context.resourcePath"
    }
}
```

- En el método **POST /api/token/consult** en el apartado **Respuesta de integración**, se deberá modificar la plantilla de mapeo en _Content-Type_ **text/plain** completar con el siguiente código:

```
##  See http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-mapping-template-reference.html
##  This template will pass through all parameters including path, querystring, header, stage variables, and context through to the integration endpoint via the body/payload
#set($allParams = $input.params())
$input.json("$.body")
#if($input.json("$.body").contains("error_name"))
#set($context.responseOverride.status = 406)
#end
```

- En el recurso **/api/token/create**, se deberá generar un método de tipo **POST** y utilizar la función Lambda **tokenCreate**.
- En el método **POST /api/token/create** en el apartado **Solicitud de método**, se deberá solicitar la cabecera _Authorization_ como obligatorio.
- En el método **POST /api/token/create** en el apartado **Solicitud de integración**, se deberá modificar la plantilla de mapeo en _Content-Type_ **text/plain** completar con el siguiente código:

```
#set($allParams = $input.params())
{
"body" : $input.body,
"headers": {
    #foreach($param in $input.params().header.keySet())
    "$param": "$util.escapeJavaScript($input.params().header.get($param))"
    #if($foreach.hasNext),#end
    #end
  },
"params" : {
#foreach($type in $allParams.keySet())
    #set($params = $allParams.get($type))
"$type" : {
    #foreach($paramName in $params.keySet())
    "$paramName" : "$util.escapeJavaScript($params.get($paramName))"
        #if($foreach.hasNext),#end
    #end
}
    #if($foreach.hasNext),#end
#end
},
"stage-variables" : {
#foreach($key in $stageVariables.keySet())
"$key" : "$util.escapeJavaScript($stageVariables.get($key))"
    #if($foreach.hasNext),#end
#end
},
"context" : {
    "account-id" : "$context.identity.accountId",
    "api-id" : "$context.apiId",
    "api-key" : "$context.identity.apiKey",
    "authorizer-principal-id" : "$context.authorizer.principalId",
    "caller" : "$context.identity.caller",
    "cognito-authentication-provider" : "$context.identity.cognitoAuthenticationProvider",
    "cognito-authentication-type" : "$context.identity.cognitoAuthenticationType",
    "cognito-identity-id" : "$context.identity.cognitoIdentityId",
    "cognito-identity-pool-id" : "$context.identity.cognitoIdentityPoolId",
    "http-method" : "$context.httpMethod",
    "stage" : "$context.stage",
    "source-ip" : "$context.identity.sourceIp",
    "user" : "$context.identity.user",
    "user-agent" : "$context.identity.userAgent",
    "user-arn" : "$context.identity.userArn",
    "request-id" : "$context.requestId",
    "resource-id" : "$context.resourceId",
    "resource-path" : "$context.resourcePath"
    }
}
```

- En el método **POST /api/token/create** en el apartado **Respuesta de integración**, se deberá modificar la plantilla de mapeo en _Content-Type_ **text/plain** completar con el siguiente código:

```
##  See http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-mapping-template-reference.html
##  This template will pass through all parameters including path, querystring, header, stage variables, and context through to the integration endpoint via the body/payload
#set($allParams = $input.params())
$input.json("$.body")
#if($input.json("$.body").contains("error_name"))
#set($context.responseOverride.status = 406)
#end
```

-En _Acciones_ del _API Gateway_ se deberá seleccionar _Implementar la API_ seleccionando la etapa.
-Se deberá copiar la ${URL*BASE} proporcionada por \_AWS*.

#### Ejecución

- En Postman se deberá ejecutar la creación del token a través de _API REST_ con los siguientes datos:
  > Método: POST
  > URL: {URL_BASE}/api/token/create
  > Authorization: Bearer pk_test_LsRBKejzCOEEWOsw
  > Body (raw - Text): "{\"card_number\":4215478569853,\"cvv\":123,\"expiration_month\":\"10\",\"expiration_year\":\"2025\",\"email\":\"faaquinoa@gmail.com\"}"

> Status Code: 200
> Response: "{\"token\":\"{token_generado}\"}"

- En Postman se deberá ejecutar la consulta del token a través de _API REST_ con los siguientes datos:
  > Método: POST
  > URL: {URL_BASE}/api/token/create
  > Authorization: Bearer pk_test_LsRBKejzCOEEWOsw
  > Body (raw - Text): "{\"token\":\"{token_generado}\"}"

> Status Code: 200
> Response: "{\"card_number\":4215478569853,\"expiration_month\":\"10\",\"expiration_year\":\"2025\",\"email\":\"faaquinoa@gmail.com\"}"

- En caso de errores el servicio proporcionará la siguiente estructura:
  > Status Code: 406
  > Response: "{\"error_name\":\"Error\",\"error_description\":\"{descripción del error}\"}"
