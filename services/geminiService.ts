


/**
 * Converte um blob/ficheiro para base64.
 */
export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/**
 * Restaura e colore a imagem usando o backend da Vercel para proteger a chave de API.
 */
export const restoreImage = async (file: File | string): Promise<string> => {
  try {
    let base64Data: string;
    if (file instanceof File) {
      base64Data = await blobToBase64(file);
    } else if (typeof file === 'string' && file.startsWith('data:')) {
      base64Data = file.split(',')[1];
    } else {
      base64Data = file;
    }

    // Chama a API Router interna (Backend)
    const response = await fetch('/api/restore', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: base64Data }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Ocorreu um erro no servidor ao processar a imagem.");
    }

    const data = await response.json();

    if (!data.restoredImage) {
      throw new Error("O motor de IA não conseguiu gerar a imagem.");
    }

    return `data:image/png;base64,${data.restoredImage}`;
  } catch (error: any) {
    console.error("Erro no Processo de Restauro:", error);
    throw error;
  }
};
