const { redEyes, kuribou } = require('../img');

const itemsMock = [{
  sellerId: '5f29aa77ca76e9494b20b492',
  name: 'Mago Oscuro Toon Tdil',
  price: 2000,
  quantity: 10,
  attribute: 'Oscuridad',
  description: `No puede atacar en el turno en el que es Invocado.
    Mientras controles Mundo Toon y tu adversario no controle monstruos 
    Toon, esta carta puede atacar a tu adversario directamente
    Una vez por turno: puedes descartar 1 carta Toon, y después activar 
    1 de estos efectos;`,
  nameOfGame: 'yugioh'
},
{
  sellerId: '5f29be061ae7225188f6d83d',
  name: 'Kuriboh',
  price: 1000,
  quantity: 100,
  attribute: 'Oscuridad',
  description: `Durante el cálculo de daño, si el monstruo de
  tu adversario ataca (Efecto Rápido): puedes descartar esta
  carta; no recibes daño de batalla de esa batalla.`,
  nameOfGame: 'yugioh'
},
{
  sellerId: '5f29be061ae7225188f6d83d',
  name: 'Cyberdark',
  price: 1500,
  quantity: 200,
  attribute: 'Oscuridad',
  description: `"Cuerno Ciberoscuro" + "Filo Ciberoscuro" + "Quilla 
  Ciberoscura "Debe ser Invocado por Fusión. Si esta carta es Invocada
  de Modo Especial:selecciona 1 monstruo Dragón en tu Cementerio;
  equipa ese objetivo a esta carta. `,
  nameOfGame: 'yugioh'
}];

module.exports = itemsMock;
