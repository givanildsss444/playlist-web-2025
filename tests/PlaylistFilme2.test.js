import { expect } from 'chai';
import { db } from './setup.js';

describe('PlaylistFilme Model - Testes adicionais', () => {
  it('Deve aceitar nota mínima e máxima válidas (1 e 5)', async () => {
    const usuario = await db.Usuario.create({ login: 'usuNota', nome: 'Usuário Notas' });
    const playlist = await db.Playlist.create({ id_usuario: usuario.id, nome: 'Playlist Notas' });
    const filme1 = await db.Filme.create({
      titulo: 'Filme Nota 1',
      genero: 'Animação',
      duracao: 80,
      ano_lancamento: 2018,
    });
    const filme2 = await db.Filme.create({
      titulo: 'Filme Nota 5',
      genero: 'Aventura',
      duracao: 95,
      ano_lancamento: 2020,
    });

    const pf1 = await db.PlaylistFilme.create({
      id_playlist: playlist.id,
      id_filme: filme1.id,
      nota_avaliacao_usuario: 1,
    });

    const pf2 = await db.PlaylistFilme.create({
      id_playlist: playlist.id,
      id_filme: filme2.id,
      nota_avaliacao_usuario: 5,
    });

    expect(pf1.nota_avaliacao_usuario).to.equal(1);
    expect(pf2.nota_avaliacao_usuario).to.equal(5);
  });

  it('Deve permitir criar PlaylistFilme sem canal', async () => {
    const usuario = await db.Usuario.create({ login: 'usuSemCanal', nome: 'Usuário Livre' });
    const playlist = await db.Playlist.create({ id_usuario: usuario.id, nome: 'Sem Canal Playlist' });
    const filme = await db.Filme.create({
      titulo: 'Filme Livre',
      genero: 'Livre',
      duracao: 100,
      ano_lancamento: 2022,
    });

    const playlistFilme = await db.PlaylistFilme.create({
      id_playlist: playlist.id,
      id_filme: filme.id,
    });

    expect(playlistFilme.id_canal).to.be.null;
  });

  it('Deve permitir criar PlaylistFilme com tempo_assistido zero e nota nula', async () => {
    const usuario = await db.Usuario.create({ login: 'usuZero', nome: 'Usuário Zero' });
    const playlist = await db.Playlist.create({ id_usuario: usuario.id, nome: 'Zero Playlist' });
    const filme = await db.Filme.create({
      titulo: 'Filme Zero',
      genero: 'Experimental',
      duracao: 60,
      ano_lancamento: 2021,
    });

    const playlistFilme = await db.PlaylistFilme.create({
      id_playlist: playlist.id,
      id_filme: filme.id,
      tempo_assistido: 0,
    });

    expect(playlistFilme.tempo_assistido).to.equal(0);
    expect(playlistFilme.nota_avaliacao_usuario).to.be.null;
  });

  it('Deve atualizar o campo assistido após visualização', async () => {
    const usuario = await db.Usuario.create({ login: 'usuAtualiza', nome: 'Usuário Atualizador' });
    const playlist = await db.Playlist.create({ id_usuario: usuario.id, nome: 'Atualiza Playlist' });
    const filme = await db.Filme.create({
      titulo: 'Filme Atualizado',
      genero: 'Documentário',
      duracao: 75,
      ano_lancamento: 2017,
    });

    const playlistFilme = await db.PlaylistFilme.create({
      id_playlist: playlist.id,
      id_filme: filme.id,
      assistido: false,
    });

    playlistFilme.assistido = true;
    playlistFilme.tempo_assistido = 750;
    playlistFilme.data_visualizacao = new Date();
    await playlistFilme.save();

    const atualizado = await db.PlaylistFilme.findByPk(playlistFilme.id);
    expect(atualizado.assistido).to.be.true;
    expect(atualizado.tempo_assistido).to.equal(750);
    expect(atualizado.data_visualizacao).to.be.instanceOf(Date);
  });
});
