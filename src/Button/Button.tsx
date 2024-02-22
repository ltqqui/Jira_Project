import styled from 'styled-components';

interface ButtonProps {
  primary?: boolean;
}

export const Button = styled.button<ButtonProps>`
  color: #fff;
  background-color: ${(props) => (props.primary ? 'blue' : 'red')};
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
`;

export const SmallButton= styled(Button)`
    background: pink;
`
