import styled from 'styled-components';

export const Container = styled.div`
    padding: 16px;
`;

export const Stack = styled.div`
    > * + * {
        margin-top: 16px;
    }
`;

export const Columns = styled.div`
    display: grid;
    grid-template-columns: repeat(${(props: {columns: number}) => props.columns}, 1fr);
    gap: 16px;
`;
