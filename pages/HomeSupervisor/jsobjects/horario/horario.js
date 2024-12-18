export default {
  getCurrentTime: function() {
    const agora = new Date();
const horaBrasilia = new Date(agora.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));

const horas = horaBrasilia.getHours().toString().padStart(2, '0');
const minutos = horaBrasilia.getMinutes().toString().padStart(2, '0');
const segundos = horaBrasilia.getSeconds().toString().padStart(2, '0');

const horarioBrasilia = `${horas}:${minutos}:${segundos}`;

storeValue("horarioBrasilia", horarioBrasilia);
  }
}