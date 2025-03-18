import { useState } from 'react';
import { View, Flex, TextField, Label, Button } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

const DynamicForm = ({ jsonData, onUpdate }) => {
  const [formData, setFormData] = useState(jsonData);

  const handleChange = (key, value) => {
    const updatedData = { ...formData, [key]: value };
    setFormData(updatedData);
    onUpdate(updatedData);
  };

  const handleApprove = () => {
    console.log('Approved Data:', formData);
  };

  return (
    <View as="form" padding="20px" border="1px solid #ccc" borderRadius="8px">
      {Object.entries(formData).map(([key, value]) => (
        <Flex key={key} direction="row" gap="small" marginBottom="10px" alignItems="center">
          <Label width="30%">{key}:</Label>
          <TextField
            value={value}
            onChange={(e) => handleChange(key, e.target.value)}
            width="70%"
          />
        </Flex>
      ))}
      <Button onClick={handleApprove} variation="primary" marginTop="20px">
        Approve
      </Button>
    </View>
  );
};

export default DynamicForm;
