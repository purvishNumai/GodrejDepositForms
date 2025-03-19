import { useState } from 'react';
import { View, Flex, TextField, Label, Button, Message } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

const DynamicForm = ({ jsonData, onUpdate }) => {
  const [formData, setFormData] = useState(jsonData);
  const [loading, setLoading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState(null);

  const handleChange = (key, value) => {
    const updatedData = { ...formData, [key]: value };
    setFormData(updatedData);
    onUpdate(updatedData);
  };

  const showMessage = (msg, duration = 3000) => {
    setUploadMessage(msg);
    setTimeout(() => setUploadMessage(null), duration);
  };

  const handleApprove = async () => {
    setLoading(true);
    setUploadMessage(null);

    try {
      const response = await fetch('https://34.228.115.185/table_insert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table_data: formData })
      });

      if (!response.ok) throw new Error(`Failed to insert data: ${response.statusText}`);

      const data = await response.json();
      console.log('API Response:', data);

      showMessage("success");

      // Refresh the entire page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Error:', error);
      showMessage("error", 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View as="form" padding="20px" border="1px solid #ccc" borderRadius="8px">
      {Object.entries(formData).map(([key, value]) => (
        <Flex key={key} direction="row" gap="small" marginBottom="10px" alignItems="center">
          <Label width="30%">{key}:</Label>
          <TextField value={value} onChange={(e) => handleChange(key, e.target.value)} width="70%" />
        </Flex>
      ))}

      <Button onClick={handleApprove} variation="primary" marginTop="20px" isDisabled={loading}>
        {loading ? "Saving..." : "Approve"}
      </Button>
      <div style={{ paddingTop: "20px" }}></div>
      {loading && (
        <Message isDismissible={false} colorTheme="info">
          ⏳ Entering data, please wait... <span className="spinner"></span>
        </Message>
      )}

      {uploadMessage === "success" && (
        <Message isDismissible={true} colorTheme="success">
          ✅ Data saved successfully!
        </Message>
      )}

      {uploadMessage === "error" && (
        <Message isDismissible={true} colorTheme="error">
          ❌ Error saving data.
        </Message>
      )}
    </View>
  );
};

export default DynamicForm;