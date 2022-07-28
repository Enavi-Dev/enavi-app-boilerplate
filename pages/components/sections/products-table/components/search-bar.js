import React, { useCallback, useState } from 'react';
import { TextField, Form, Button, Icon, Card } from '@shopify/polaris';
import { SearchMajor } from '@shopify/polaris-icons';



export default function SearchBar(props) {
    const { value, handleQueryChange, handleClearButton, lunchSearch } = props;

    return (
        <Form noValidate onSubmit={lunchSearch}>
            <TextField
                placeholder="Search Query..."
                value={value}
                onChange={handleQueryChange}
                clearButton
                onClearButtonClick={handleClearButton}
                autoComplete="off"
                prefix={<Icon source={SearchMajor} />}
                connectedRight={<Button submit primary> Search</Button>} />
        </Form>
    );
}
