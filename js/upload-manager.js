/**
 * UPLOAD MANAGER - Gerencia drag & drop e estado de upload
 */

const UploadManager = {
    file: null,
    xhr: null,
    isUploading: false,
    
    init() {
        this.renderUploadZone();
        this.bindEvents();
    },
    
    renderUploadZone() {
        const container = document.querySelector('.glass-container');
        
        // Inserir antes dos controles
        const controls = container.querySelector('.controls');
        const uploadZone = document.createElement('div');
        uploadZone.className = 'upload-zone';
        uploadZone.id = 'upload-zone';
        uploadZone.innerHTML = `
            <div class="upload-icon">📁</div>
            <div class="upload-text">Arraste um arquivo aqui</div>
            <div class="upload-hint">ou clique para selecionar • Máx. 10MB</div>
            <input type="file" class="upload-input" id="file-input" accept="image/*,.pdf,.txt,.json,.doc,.docx">
        `;
        
        container.insertBefore(uploadZone, controls);
        
        // File list (inicialmente hidden)
        const fileList = document.createElement('div');
        fileList.className = 'file-list hidden';
        fileList.id = 'file-list';
        container.insertBefore(fileList, controls);
    },
    
    bindEvents() {
        const zone = document.getElementById('upload-zone');
        const input = document.getElementById('file-input');
        
        // Click
        zone.addEventListener('click', () => {
            if (!this.isUploading) input.click();
        });
        
        // File selected
        input.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFile(e.target.files[0]);
            }
        });
        
        // Drag & Drop
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(event => {
            zone.addEventListener(event, (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
        });
        
        ['dragenter', 'dragover'].forEach(event => {
            zone.addEventListener(event, () => zone.classList.add('dragover'));
        });
        
        ['dragleave', 'drop'].forEach(event => {
            zone.addEventListener(event, () => zone.classList.remove('dragover'));
        });
        
        zone.addEventListener('drop', (e) => {
            if (!this.isUploading && e.dataTransfer.files.length > 0) {
                this.handleFile(e.dataTransfer.files[0]);
            }
        });
    },
    
    handleFile(file) {
        const validation = ApiClient.validate(file);
        if (!validation.valid) {
            alert(validation.error); // Simples por enquanto, pode ser um toast depois
            return;
        }
        
        this.file = file;
        this.showFileInfo(file);
        this.startUpload(file);
    },
    
    showFileInfo(file) {
        const zone = document.getElementById('upload-zone');
        const list = document.getElementById('file-list');
        
        zone.classList.add('hidden');
        list.classList.remove('hidden');
        
        const icon = this.getFileIcon(file.type);
        
        list.innerHTML = `
            <div class="file-item">
                <span class="file-icon">${icon}</span>
                <div class="file-info">
                    <div class="file-name">${this.escapeHtml(file.name)}</div>
                    <div class="file-meta">${ApiClient.formatSize(file.size)} • ${file.type || 'Desconhecido'}</div>
                </div>
                <button class="file-remove" id="remove-file" title="Remover">×</button>
            </div>
        `;
        
        document.getElementById('remove-file').addEventListener('click', () => this.reset());
    },
    
    startUpload(file) {
        this.isUploading = true;
        
        // Desabilitar controles durante upload
        UI.elements.btnPause.hidden = true;
        UI.elements.btnError.hidden = true;
        
        // Atualizar estado
        State.target = 100;
        State.stepIndex = 0;
        UI.updateStep(0);
        
        this.xhr = ApiClient.upload(
            file,
            // onProgress
            (percent, loaded, total) => {
                State.current = percent;
                UI.updateProgress(percent);
                
                // Atualizar mensagem com bytes
                const loadedStr = ApiClient.formatSize(loaded);
                const totalStr = ApiClient.formatSize(total);
                UI.elements.message.textContent = `Enviando... ${loadedStr} / ${totalStr}`;
            },
            // onComplete
            (response) => {
                this.isUploading = false;
                State.current = 100;
                UI.updateProgress(100);
                
                // Pequeno delay para mostrar 100%
                setTimeout(() => {
                    Progress.complete();
                    UI.elements.message.textContent = 'Upload concluído com sucesso!';
                }, 500);
            },
            // onError
            (error) => {
                this.isUploading = false;
                State.isError = true;
                UI.elements.message.textContent = error;
                UI.elements.step.textContent = 'Erro';
                UI.elements.step.style.color = 'var(--error)';
                
                // Mostrar botão de reiniciar
                UI.elements.btnPause.hidden = true;
                UI.elements.btnError.hidden = true;
                UI.elements.btnRestart.hidden = false;
            }
        );
    },
    
    reset() {
        // Abortar upload se estiver em andamento
        if (this.xhr) {
            this.xhr.abort();
            this.xhr = null;
        }
        
        this.file = null;
        this.isUploading = false;
        
        // Reset UI
        const zone = document.getElementById('upload-zone');
        const list = document.getElementById('file-list');
        
        zone.classList.remove('hidden');
        list.classList.add('hidden');
        list.innerHTML = '';
        
        // Reset loader
        Progress.restart();
    },
    
    getFileIcon(type) {
        if (type.startsWith('image/')) return '🖼️';
        if (type === 'application/pdf') return '📄';
        if (type.startsWith('text/')) return '📝';
        if (type.includes('word')) return '📃';
        return '📦';
    },
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};