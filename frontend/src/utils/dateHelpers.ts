

//Formata a data
export function formatDate(dateString?: string) {
  if (!dateString) return null;
  const [year, month, day] = dateString.split("-");
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  const months = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

//Verifica se esta atrasado
export function isOverdue(deliveryDate?: string, completed?: boolean) {
  if (!deliveryDate || completed) return false;
  const [year, month, day] = deliveryDate.split("-");
  const deliveryDateObj = new Date(Number(year), Number(month) - 1, Number(day));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return deliveryDateObj < today;
}