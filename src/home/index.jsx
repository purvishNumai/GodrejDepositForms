import { useRef, useState } from 'react';
import { Button, Heading, Flex, View, Text, TextField, useTheme, Message, IconsProvider } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { uploadData } from 'aws-amplify/storage';
import DynamicForm from './DynamicForm';

import { FcMediumPriority, FcHighPriority, FcInfo, FcOk, FcMinus } from 'react-icons/fc';

const Home = ({ children, signOut }) => {
  const { tokens } = useTheme();
  const [activeButton, setActiveButton] = useState("dashboard");
  const [file, setFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);
  const [jsonData, setJsonData] = useState(null);

  const handleNavigation = (buttonName) => setActiveButton(buttonName);

  const getButtonStyle = (buttonName) => ({
    backgroundColor: activeButton === buttonName ? tokens.colors.primary[60] : "transparent",
    color: activeButton === buttonName ? tokens.colors.white : tokens.colors.font.primary,
  });

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setFile(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => e.preventDefault();

  const getFormattedDateTime = () => {
    const now = new Date();
    return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
  };

  const showMessage = (msg, duration = 3000) => {
    setUploadMessage(msg);
    setTimeout(() => setUploadMessage(null), duration);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploadMessage(null);
    setJsonData(null);
    setLoading(true);  // Start loading spinner

    const fileName = `${getFormattedDateTime()}_${file.name}`;

    try {
      const result = await uploadData({
        path: `public/inputfile/${fileName}`,
        data: file,
        options: { onProgress: (progress) => console.log(`Progress: ${progress.loaded}/${progress.total}`) }
      }).result;


      showMessage("success");

      const response = await fetch('/api/form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath: result.path })
      });

      if (!response.ok) throw new Error('Failed to fetch JSON data');

      let data = await response.json();
      setLoading(false); // Stop loading
      data = JSON.parse(data);
      setJsonData(data[0]);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      console.error("Error:", error);
      setLoading(false); // Stop loading
      showMessage("error", 5000);
    }
  };

  const handleUpdate = (updatedData) => {
    setJsonData(updatedData);
    console.log('Updated JSON:', updatedData);
  };

  return (
    <IconsProvider icons={{ message: { info: <FcInfo />, success: <FcOk />, error: <FcHighPriority />, warning: <FcMediumPriority />, close: <FcMinus /> } }}>
      <Flex direction="column" height="100vh">
        <View backgroundColor={tokens.colors.primary[80]} padding={tokens.space.medium} as="header">
          <Flex justifyContent="space-between" alignItems="center">
            <Heading level={3} color={tokens.colors.white}>Godrej Deposit Form</Heading>
            <Button onClick={signOut}>Sign Out</Button>
          </Flex>
        </View>

        <Flex flex="1" overflow="hidden">
          <View width="250px" backgroundColor={tokens.colors.neutral[10]} padding={tokens.space.medium} as="aside">
            <Heading level={5} marginBottom={tokens.space.medium}>Navigation</Heading>
            <Flex direction="column" gap={tokens.space.small}>
              <Button variation="link" style={getButtonStyle("dashboard")} onClick={() => handleNavigation("dashboard")}>Process Image</Button>
              {/* <Button variation="link" style={getButtonStyle("settings")} onClick={() => handleNavigation("settings")}>Settings</Button> */}
            </Flex>
          </View>

          <View flex="1" padding={tokens.space.medium} backgroundColor={tokens.colors.background.primary} overflow="auto" as="main">
            {children}

            <Flex gap="20px" marginTop="20px" alignItems="center" onDrop={handleDrop} onDragOver={handleDragOver} border="2px dashed #ccc" padding="20px" borderRadius="8px" justifyContent="center" textAlign="center">
              <Text>Drag and drop a file here, or</Text>
              <TextField type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} id="fileInput" />
              <Button onClick={() => document.getElementById('fileInput').click()}>Choose File</Button>
            </Flex>

            {file && <Text marginTop="10px">Selected file: {file.name}</Text>}
            <Button onClick={handleUpload} variation="primary" marginTop="20px">Upload File</Button>
            <div style={{ paddingTop: "20px" }}></div>

            {uploadMessage === "success" && (
              <Message isDismissible={true} colorTheme="success">
                ✅ File uploaded successfully!
              </Message>
            )}

            {uploadMessage === "error" && (
              <Message isDismissible={true} colorTheme="error">
                ❌ Error uploading file.
              </Message>
            )}

            {loading && (
              <Message isDismissible={false} colorTheme="info">
                ⏳ "Processing uploaded file ... <span className="spinner"></span>
              </Message>
            )}

            {jsonData && (
              <View marginTop="30px" className="dynamic-form-container">
                <div style={{ color: 'black' }}>Please verify the fields and Approve</div>
                <DynamicForm jsonData={jsonData} onUpdate={handleUpdate} />
                <pre>{JSON.stringify(jsonData, null, 2)}</pre>
              </View>
            )}
          </View>
        </Flex>

        <View backgroundColor={tokens.colors.neutral[20]} padding={tokens.space.medium} as="footer">
          <Flex justifyContent="space-between" alignItems="center">
            <Text>&copy; {new Date().getFullYear()} Godrej Deposit Form</Text>
            <Flex gap={tokens.space.large}>
              <Text>Privacy Policy</Text>
              <Text>Terms of Service</Text>
              <Text>Contact</Text>
            </Flex>
          </Flex>
        </View>
      </Flex>
    </IconsProvider>
  );
};

export default Home;