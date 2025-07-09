import { expect } from 'chai';
import { db } from './setup.js';

describe('Canal Model - Testes adicionais', () => {
  it('Deve permitir criar dois canais com mesmo tema, mas nomes diferentes', async () => {
    const canal1 = await db.Canal.create({
      nome: 'Canal Alpha',
      data_criacao: new Date('2023-01-01'),
      genero_tema: 'Educação',
    });

    const canal2 = await db.Canal.create({
      nome: 'Canal Beta',
      data_criacao: new Date('2023-02-01'),
      genero_tema: 'Educação',
    });

    expect(canal1.genero_tema).to.equal(canal2.genero_tema);
    expect(canal1.nome).to.not.equal(canal2.nome);
  });

  it('Deve aceitar data_criacao no formato ISO string', async () => {
    const canal = await db.Canal.create({
      nome: 'Canal ISO',
      data_criacao: '2023-03-10T00:00:00.000Z',
      genero_tema: 'Tecnologia',
    });

    expect(new Date(canal.data_criacao).toISOString()).to.include('2023-03-10');
  });

  it('Deve permitir criar canal com nome contendo acentos', async () => {
    const canal = await db.Canal.create({
      nome: 'Canal Ciência & Saúde',
      data_criacao: new Date('2022-12-01'),
      genero_tema: 'Saúde',
    });

    expect(canal.nome).to.include('Ciência');
  });

  it('Deve permitir múltiplos canais com mesmo data_criacao', async () => {
    const dataComum = new Date('2023-01-01');

    const canal1 = await db.Canal.create({
      nome: 'Canal 1',
      data_criacao: dataComum,
      genero_tema: 'Esportes',
    });

    const canal2 = await db.Canal.create({
      nome: 'Canal 2',
      data_criacao: dataComum,
      genero_tema: 'Documentário',
    });

    expect(canal1.data_criacao.toISOString()).to.equal(canal2.data_criacao.toISOString());
  });

  it('Não deve aceitar nome maior que 100 caracteres', async () => {
    try {
      await db.Canal.create({
        nome: 'A'.repeat(101),
        data_criacao: new Date(),
        genero_tema: 'Música',
      });
      expect.fail('Deveria ter lançado erro de validação');
    } catch (error) {
      expect(error.name).to.equal('SequelizeDatabaseError'); // dependendo do banco, pode lançar esse erro
    }
  });
});
