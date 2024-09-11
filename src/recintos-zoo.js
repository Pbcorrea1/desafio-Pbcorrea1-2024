class Animais {
  constructor() {
    this.animais = {
      LEAO: { tamanho: 3, bioma: ['savana'], tipo: 'carnívoro' },
      LEOPARDO: { tamanho: 2, bioma: ['savana'], tipo: 'carnívoro' },
      CROCODILO: { tamanho: 3, bioma: ['rio'], tipo: 'carnívoro' },
      MACACO: { tamanho: 1, bioma: ['savana', 'floresta'], tipo: 'herbívoro' },
      GAZELA: { tamanho: 2, bioma: ['savana'], tipo: 'herbívoro' },
      HIPOPOTAMO: { tamanho: 4, bioma: ['savana', 'rio'], tipo: 'herbívoro' }
    };
  }
}

class RecintosZoo {
  constructor() {
    this.recintos = [
      { numero: 1, bioma: 'savana', tamanhoTotal: 10, animaisExistentes: [{ especie: 'MACACO', quantidade: 3, tipo: 'herbívoro' }] },
      { numero: 2, bioma: 'floresta', tamanhoTotal: 5, animaisExistentes: [] },
      { numero: 3, bioma: 'savana e rio', tamanhoTotal: 7, animaisExistentes: [{ especie: 'GAZELA', quantidade: 1, tipo: 'herbívoro' }] },
      { numero: 4, bioma: 'rio', tamanhoTotal: 8, animaisExistentes: [] },
      { numero: 5, bioma: 'savana', tamanhoTotal: 9, animaisExistentes: [{ especie: 'LEAO', quantidade: 1, tipo: 'carnívoro' }] },
    ];

    this.animais = new Animais();
  }

  

  analisaRecintos(tipoAnimal, quantidade) {
    // Verificar se o tipo de animal é válido
    if (!this.animais.animais[tipoAnimal]) {
      return { erro: 'Animal inválido', recintosViaveis: null };
    }

    // Verificar se a quantidade é válida
    if (!Number.isInteger(quantidade) || quantidade <= 0) {
      return { erro: 'Quantidade inválida', recintosViaveis: null };
    }

    const animal = this.animais.animais[tipoAnimal];
    const tamanhoNecessario = animal.tamanho * quantidade;

    // Filtrar recintos viáveis
    const recintosViaveis = this.recintos.filter(recinto => {
      // Verificar bioma compatível
      const biomaCompativel = animal.bioma.includes(recinto.bioma) || recinto.bioma === 'savana e rio';
      if (!biomaCompativel) return false;

      // Verificar coexistência de herbívoros e carnívoros
      const herbivorosExistentes = recinto.animaisExistentes.some(a => this.animais.animais[a.especie].tipo === 'herbívoro');
      if (herbivorosExistentes && animal.tipo === 'carnívoro') return false;

      const carnivorosExistentes = recinto.animaisExistentes.some(a => this.animais.animais[a.especie].tipo === 'carnívoro');
      if (carnivorosExistentes && animal.tipo === 'herbívoro') return false;

      // Calcular espaço disponível
      let espacoOcupado = recinto.animaisExistentes.reduce((soma, a) => {
        const especieTamanho = this.animais.animais[a.especie].tamanho;
        return soma + (especieTamanho * a.quantidade);
      }, 0);

      // Espaço extra caso haja mais de uma espécie no recinto
      const espacoExtra = recinto.animaisExistentes.length > 0 && !recinto.animaisExistentes.some(a => a.especie === tipoAnimal) ? 1 : 0;
      const espacoDisponivel = recinto.tamanhoTotal - espacoOcupado - espacoExtra;

      return espacoDisponivel >= tamanhoNecessario;
    });

    // Verificar se há recintos viáveis
    if (recintosViaveis.length === 0) {
      return { erro: 'Não há recinto viável', recintosViaveis: null };
    }

    // Listar recintos viáveis
    const listaRecintos = recintosViaveis.map(recinto => {
      let espacoOcupado = recinto.animaisExistentes.reduce((soma, a) => {
        return soma + (this.animais.animais[a.especie].tamanho * a.quantidade);
      }, 0);

      const espacoExtra = recinto.animaisExistentes.length > 0 && !recinto.animaisExistentes.some(a => a.especie === tipoAnimal) ? 1 : 0;
      const espacoRestante = recinto.tamanhoTotal - espacoOcupado - espacoExtra - tamanhoNecessario;

      return `Recinto ${recinto.numero} (espaço livre: ${espacoRestante} total: ${recinto.tamanhoTotal})`;
    });

    return { recintosViaveis: listaRecintos };
  }
}

// Testando a chamada:
export { RecintosZoo as RecintosZoo };
const zoo = new RecintosZoo();
console.log(zoo.analisaRecintos('LEAO', 1));
