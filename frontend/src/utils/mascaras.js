export const formatarCPF = (valor) => {
  return valor
    .replace(/\D/g, '')
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{2})$/, '$1-$2');
};

// Formatar CNPJ: 12.345.678/0001-90
export const formatarCNPJ = (valor) => {
  return valor
    .replace(/\D/g, '')
    .slice(0, 14)
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
};

// Formatar Telefone: (11)99999-9999
export const formatarTelefone = (valor) => {
  if (!valor) return "";
  
  // Remove tudo que não é número
  const busca = valor.replace(/\D/g, '');
  
  // (11) 98888-7777 ou (11) 8888-7777
  return busca
    .replace(/(\d{2})(\d)/, '($1) $2') // Coloca parênteses no DDD
    .replace(/(\d{4,5})(\d{4})$/, '$1-$2') // Coloca hífen antes dos últimos 4 dígitos
    .slice(0, 15); // Limita o tamanho final com a máscara
};

// Formatar CEP: 01311-100
export const formatarCEP = (valor) => {
  return valor
    .replace(/\D/g, '')
    .slice(0, 8)
    .replace(/(\d{5})(\d)/, '$1-$2');
};

// Validar CPF
export const validarCPF = (cpf) => {
  const numeros = cpf.replace(/\D/g, '');
  if (numeros.length !== 11) return false;
  
  let sum = 0;
  let remainder;
  
  if (numeros === '00000000000') return false;
  
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(numeros[i - 1]) * (11 - i);
  }
  
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(numeros[9])) return false;
  
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(numeros[i - 1]) * (12 - i);
  }
  
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(numeros[10])) return false;
  
  return true;
};

export const desformatar = (valor) => valor ? valor.replace(/\D/g, '') : '';

// Validar CNPJ
export const validarCNPJ = (cnpj) => {
  const numeros = cnpj.replace(/\D/g, '');
  if (numeros.length !== 14) return false;
  
  if (/^(\d)\1{13}$/.test(numeros)) return false;
  
  let size = numeros.length - 2;
  let numbers = numeros.substring(0, size);
  let digits = numeros.substring(size);
  let sum = 0;
  let pos = size - 7;
  
  for (let i = size; i >= 1; i--) {
    sum += numbers.charAt(size - i) * pos--;
    if (pos < 2) pos = 9;
  }
  
  let result = sum % 11 < 2 ? 0 : 11 - sum % 11;
  if (result !== parseInt(digits.charAt(0))) return false;
  
  size = size + 1;
  numbers = numeros.substring(0, size);
  sum = 0;
  pos = size - 7;
  
  for (let i = size; i >= 1; i--) {
    sum += numbers.charAt(size - i) * pos--;
    if (pos < 2) pos = 9;
  }
  
  result = sum % 11 < 2 ? 0 : 11 - sum % 11;
  if (result !== parseInt(digits.charAt(1))) return false;
  
  return true;
};