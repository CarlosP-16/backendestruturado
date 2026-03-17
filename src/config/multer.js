// Importa a biblioteca multer, usada para fazer upload de arquivos em aplicações Node.js com Express
const multer = require('multer');

// Importa o módulo path do Node.js, utilizado para trabalhar com caminhos de arquivos e diretórios
const path = require('path');

// Importa o módulo fs (File System), que permite manipular arquivos e pastas no sistema operacional
const fs = require('fs');

// Cria o caminho absoluto para a pasta "uploads"
// __dirname representa o diretório atual do arquivo
// '..', '..' volta duas pastas na estrutura do projeto
// 'uploads' é o nome da pasta onde os arquivos enviados serão armazenados
const uploadDir = path.join(__dirname, '..', '..', 'uploads');

// Verifica se a pasta "uploads" já existe no sistema
if (!fs.existsSync(uploadDir)) {

  // Caso a pasta não exista, ela será criada automaticamente
  // recursive: true permite criar toda a estrutura de diretórios necessária
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Define a configuração de armazenamento dos arquivos enviados
const storage = multer.diskStorage({

  // Define o destino onde os arquivos serão salvos
  destination: (req, file, cb) => {

    // cb significa callback
    // null indica que não houve erro
    // uploadDir é a pasta onde o arquivo será salvo
    cb(null, uploadDir);
  },

  // Define o nome do arquivo que será salvo no servidor
  filename: (req, file, cb) => {

    // Cria um identificador único usando a data atual em milissegundos
    // + um número aleatório para evitar arquivos com nomes repetidos
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);

    // Obtém a extensão original do arquivo enviado (ex: .jpg, .png)
    const ext = path.extname(file.originalname);

    // Define o nome final do arquivo que será salvo
    // Exemplo: foto-1710000000000-123456789.jpg
    cb(null, `foto-${uniqueSuffix}${ext}`);
  }
});

// Cria um filtro para permitir apenas determinados tipos de arquivos
const fileFilter = (req, file, cb) => {

  // Define os tipos de extensões permitidas (imagens)
  const allowedTypes = /jpeg|jpg|png|gif|webp/;

  // Verifica se a extensão do arquivo enviado está na lista permitida
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  // Verifica se o tipo MIME do arquivo também corresponde a um tipo permitido
  const mimetype = allowedTypes.test(file.mimetype);

  // Se tanto o MIME type quanto a extensão forem válidos
  if (mimetype && extname) {

    // Permite o upload do arquivo
    return cb(null, true);

  } else {

    // Caso contrário, retorna um erro informando que apenas imagens são permitidas
    cb(new Error('Apenas imagens são permitidas (jpeg, jpg, png, gif, webp)'));
  }
};

// Cria a configuração final do multer
const upload = multer({

  // Define o método de armazenamento configurado anteriormente
  storage: storage,

  // Define o limite máximo de tamanho do arquivo
  // 5 * 1024 * 1024 = 5MB
  limits: { fileSize: 5 * 1024 * 1024 },

  // Aplica o filtro de arquivos criado anteriormente
  fileFilter: fileFilter
});

// Exporta a configuração de upload para ser usada em outras partes do projeto
module.exports = upload;