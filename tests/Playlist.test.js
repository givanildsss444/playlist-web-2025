import { expect } from 'chai';
import { sequelize, db } from './setup.js';

describe('Playlist Model', () => {
  it('Deve criar uma playlist com dados válidos', async () => {
    const usuario = await db.Usuario.create({
      login: 'usuario123',
      nome: 'Usuário Teste',
    });

    const playlist = await db.Playlist.create({
      id_usuario: usuario.id,
      nome: 'Playlist Top 10',
      data_criacao: new Date("2024/07/09")
    });

    expect(playlist).to.have.property('id');
    expect(playlist.id_usuario).to.equal(usuario.id);
    expect(playlist.nome).to.equal('Playlist Top 10');
    expect(playlist.data_criacao).to.be.instanceOf(Date);
  });

  it('Não deve criar uma playlist sem id_usuario', async () => {
    try {
      await db.Playlist.create({
        nome: 'Playlist sem dono',
      });
      expect.fail('Deveria ter lançado um erro de validação');
    } catch (error) {
      expect(error.name).to.equal('SequelizeValidationError');
    }
  });

  it('Deve permitir nome nulo (se não for obrigatório)', async () => {
    const usuario = await db.Usuario.create({
      login: 'usuario456',
      nome: 'Usuário Sem Nome de Playlist',
    });

    const playlist = await db.Playlist.create({
      id_usuario: usuario.id,
      nome: null,
    });

    expect(playlist.nome).to.be.null;
  });

  it('Deve criar múltiplas playlists para um único usuário', async () => {
    const usuario = await db.Usuario.create({
      login: 'multiusuario',
      nome: 'Usuário Múltiplo',
    });

    await db.Playlist.create({ id_usuario: usuario.id, nome: 'Rock' });
    await db.Playlist.create({ id_usuario: usuario.id, nome: 'Pop' });

    const playlists = await usuario.getPlaylists();

    expect(playlists).to.have.lengthOf(2);
    expect(playlists.map(p => p.nome)).to.include.members(['Rock', 'Pop']);
  });
});
