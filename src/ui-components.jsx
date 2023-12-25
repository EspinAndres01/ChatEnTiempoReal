import styled from 'styled-components';

const UlMensajes = styled.ul`
  max-width: 800px;
  margin: 10px auto;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 0;
`;

const LiMensaje = styled.li`
  background-color: #6441a5;
  border-radius: 10px;
  padding: 10px 15px;
  color: white;
  max-width: 70%;
  align-self: flex-start;
`;

const LiMensajePropio = styled(LiMensaje)`
  align-self: flex-end;
  background-color: #9147ff;
`;

export { UlMensajes, LiMensaje, LiMensajePropio };
