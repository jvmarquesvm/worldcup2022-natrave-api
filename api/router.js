import Router from '@koa/router'
import * as users from './users/index.js'
import * as hunches from './hunches/index.js'
import * as games from './games/index.js'

export const router = new Router()

router.get('/games', games.listGames);
router.post('/users', users.create);
router.get('/users', users.listUsers);
router.get('/login', users.login);
router.get('/:username', users.listHunches);
router.post('/hunches', hunches.create);