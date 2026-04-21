/**
 * API CLIENT - Cliente para upload com progresso real
 */

const ApiClient = {
    ENDPOINT: 'https://httpbin.org/post',
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: [
        'image/', 
        'application/pdf', 
        'text/',
        'application/json',
        'application/msword',
        'application/vnd.openxmlformats-officedocument'
    ],
    
    /**
     * Valida arquivo antes do upload
     */
    validate(file) {
        // Tamanho
        if (file.size > this.MAX_SIZE) {
            return { valid: false, error: `Arquivo muito grande. Máximo: ${this.formatSize(this.MAX_SIZE)}` };
        }
        
        // Tipo
        const isAllowed = this.ALLOWED_TYPES.some(type => file.type.startsWith(type));
        if (!isAllowed && file.type !== '') {
            return { valid: false, error: 'Tipo de arquivo não permitido. Use imagens, PDFs ou textos.' };
        }
        
        return { valid: true };
    },
    
    /**
     * Faz upload com monitoramento de progresso
     */
    upload(file, onProgress, onComplete, onError) {
        const validation = this.validate(file);
        if (!validation.valid) {
            onError(validation.error);
            return null;
        }
        
        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        formData.append('file', file);
        
        // Monitorar progresso
        xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable) {
                const percent = Math.round((e.loaded / e.total) * 100);
                onProgress(percent, e.loaded, e.total);
            }
        });
        
        // Completo
        xhr.addEventListener('load', () => {
            if (xhr.status === 200) {
                onComplete(xhr.response);
            } else {
                onError(`Erro do servidor: ${xhr.status}`);
            }
        });
        
        // Erro
        xhr.addEventListener('error', () => onError('Falha na conexão. Verifique sua internet.'));
        xhr.addEventListener('abort', () => onError('Upload cancelado.'));
        
        xhr.open('POST', this.ENDPOINT);
        xhr.send(formData);
        
        return xhr; // Retorna para poder abortar
    },
    
    /**
     * Formata bytes para human readable
     */
    formatSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
};