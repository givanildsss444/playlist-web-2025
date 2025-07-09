import { expect } from 'chai';
import { db } from './setup.js';

describe('CanalFilme Model', () => {
  it('Deve criar um CanalFilme com dados válidos', async () => {
    const canal = await db.Canal.create({
      nome: 'Canal Teste',
      data_criacao: new Date('2022-01-01'),
      genero_tema: 'Drama',
    });

    const filme = await db.Filme.create({
      titulo: 'Filme Teste',
      genero: 'Drama',
      duracao: 120,
      ano_lancamento: 2020,
    });

    const canalFilme = await db.CanalFilme.create({
      id_canal: canal.id,
      id_filme: filme.id,
      data_recomendacao: new Date('2023-06-15'),
    });

    expect(canalFilme).to.have.property('id');
    expect(canalFilme.id_canal).to.equal(canal.id);
    expect(canalFilme.id_filme).to.equal(filme.id);
    expect(canalFilme.data_recomendacao).to.be.instanceOf(Date);
  });

  it('Não deve criar CanalFilme sem id_canal', async () => {
    const filme = await db.Filme.create({
      titulo: 'Filme Sem Canal',
      genero: 'Ação',
      duracao: 100,
      ano_lancamento: 2021,
    });

    try {
      await db.CanalFilme.create({
        id_filme: filme.id,
      });
      expect.fail('Deveria lançar erro de validação');
    } catch (error) {
      expect(error.name).to.equal('SequelizeValidationError');
    }
  });

  it('Não deve criar CanalFilme sem id_filme', async () => {
    const canal = await db.Canal.create({
      nome: 'Canal Sem Filme',
      data_criacao: new Date('2021-05-01'),
      genero_tema: 'Comédia',
    });

    try {
      await db.CanalFilme.create({
        id_canal: canal.id,
      });
      expect.fail('Deveria lançar erro de validação');
    } catch (error) {
      expect(error.name).to.equal('SequelizeValidationError');
    }
  });

  it('Deve atribuir data_recomendacao automaticamente se não fornecida', async () => {
    const canal = await db.Canal.create({
      nome: 'Canal Automático',
      data_criacao: new Date('2020-10-10'),
      genero_tema: 'Suspense',
    });

    const filme = await db.Filme.create({
      titulo: 'Filme Automático',
      genero: 'Suspense',
      duracao: 110,
      ano_lancamento: 2019,
    });

    const canalFilme = await db.CanalFilme.create({
      id_canal: canal.id,
      id_filme: filme.id,
    });

    expect(canalFilme.data_recomendacao).to.be.instanceOf(Date);
  });
});
