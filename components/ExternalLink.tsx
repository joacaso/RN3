import React from 'react';
import { Linking, Text, TouchableOpacity } from 'react-native';

interface ExternalLinkProps {
  href: string;
  children: React.ReactNode;
}

const ExternalLink: React.FC<ExternalLinkProps> = ({ href, children }) => {
  const handlePress = () => {
    if (href) {
      Linking.openURL(href).catch((err) =>
        console.error("Error al abrir el enlace:", err)
      );
    } else {
      console.warn("El enlace no está definido");
    }
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Text style={{ color: 'blue' }}>{children}</Text>
    </TouchableOpacity>
  );
};

export default ExternalLink;