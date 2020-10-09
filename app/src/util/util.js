import { RESPONSE_SOURCE } from '../config/config';

export function formatGame(game) {
  return {
    hasUpdate: false,
    gameId: game.id,
    hostId: game.hostId,
    guestID: game.guestId,
    host: game.host,
    guest: game.guest,
    status: game.status,
    chosenWord: game.chosenWord,
    winnerId: game.winnerId,
    responses: game.responses.map((response) => {
      return {
        source:
          response.userID === game.hostId
            ? RESPONSE_SOURCE.HOST
            : RESPONSE_SOURCE.GUEST,
        text: response.response,
      };
    }),
  };
}
