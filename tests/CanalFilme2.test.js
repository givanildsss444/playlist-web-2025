import { expect } from 'chai';
import { db } from './setup.js';

describe('CanalFilme Model - Testes adicionais', () => {

  it('Deve atualizar a data_recomendacao de um CanalFilme', async () => {
    const canal = await db.Canal.create({
      nome: 'Canal Atualizar',
      data_criacao: new Date('2021-01-01'),
      genero_tema: 'Drama',
    });

    const filme = await db.Filme.create({
      titulo: 'Filme Atualizar',
      genero: 'Drama',
      duracao: 90,
      ano_lancamento: 2020,
    });

    const canalFilme = await db.CanalFilme.create({
      id_canal: canal.id,
      id_filme: filme.id,
    });

    const novaData = new Date('2024-01-01');
    canalFilme.data_recomendacao = novaData;
    await canalFilme.save();

    const atualizado = await db.CanalFilme.findByPk(canalFilme.id);
    expect(atualizado.data_recomendacao.getTime()).to.equal(novaData.getTime());
  });

  it('Deve excluir um CanalFilme', async () => {
    const canal = await db.Canal.create({
      nome: 'Canal Excluir',
      data_criacao: new Date('2021-06-01'),
      genero_tema: 'Comédia',
    });

    const filme = await db.Filme.create({
      titulo: 'Filme Excluir',
      genero: 'Comédia',
      duracao: 100,
      ano_lancamento: 2021,
    });

    const canalFilme = await db.CanalFilme.create({
      id_canal: canal.id,
      id_filme: filme.id,
    });

    const id = canalFilme.id;
    await canalFilme.destroy();

    const encontrado = await db.CanalFilme.findByPk(id);
    expect(encontrado).to.be.null;
  });

  it('Deve buscar CanalFilmes por id_canal', async () => {
    const canal1 = await db.Canal.create({
      nome: 'Canal Filtro 1',
      data_criacao: new Date('2020-05-01'),
      genero_tema: 'Suspense',
    });

    const canal2 = await db.Canal.create({
      nome: 'Canal Filtro 2',
      data_criacao: new Date('2020-06-01'),
      genero_tema: 'Terror',
    });

    const filme = await db.Filme.create({
      titulo: 'Filme Filtro',
      genero: 'Suspense',
      duracao: 95,
      ano_lancamento: 2018,
    });

    await db.CanalFilme.create({ id_canal: canal1.id, id_filme: filme.id });
    await db.CanalFilme.create({ id_canal: canal2.id, id_filme: filme.id });

    const canal1Filmes = await db.CanalFilme.findAll({ where: { id_canal: canal1.id } });
    expect(canal1Filmes).to.have.lengthOf.at.least(1);
    canal1Filmes.forEach(cf => expect(cf.id_canal).to.equal(canal1.id));
  });

});
