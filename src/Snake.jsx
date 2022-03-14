import React from 'react';
import SnakeDot from './SnakeDot';

export default (props) => {

    return props.snakeDots.map((dot, i) => {
        return <SnakeDot dot={dot} key={i} />
    })
}