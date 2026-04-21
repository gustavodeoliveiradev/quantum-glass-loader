/**
 * DISCLAIMER - Modal de segurança para upload
 */

const Disclaimer = {
    STORAGE_KEY: 'quantum-loader-disclaimer-accepted',
    
    init() {
        if (!this.hasAccepted()) {
            this.show();
        }
    },
    
    hasAccepted() {
        return localStorage.getItem(this.STORAGE_KEY) === 'true';
    },
    
    accept() {
        localStorage.setItem(this.STORAGE_KEY, 'true');
        this.hide();
    },
    
    show() {
        const overlay = document.getElementById('disclaimer-overlay');
        if (overlay) overlay.classList.add('active');
    },
    
    hide() {
        const overlay = document.getElementById('disclaimer-overlay');
        if (overlay) overlay.classList.remove('active');
    },
    
    render() {
        const modal = document.createElement('div');
        modal.id = 'disclaimer-overlay';
        modal.className = 'disclaimer-overlay';
        modal.innerHTML = `
            <div class="disclaimer-modal">
                <h2 class="disclaimer-title">Segurança Primeiro</h2>
                <p class="disclaimer-text">
                    Esta é uma <strong>aplicação de demonstração técnica</strong> 
                    criada como parte da trajetória de estudos de um desenvolvedor. 
                    O upload funciona da seguinte forma:
                </p>
                <ul class="disclaimer-list">
                    <li>Seus arquivos são enviados diretamente para um serviço de teste público (httpbin.org)</li>
                    <li>Nada é armazenado permanentemente — tudo é descartado automaticamente</li>
                    <li>Não coletamos dados pessoais, localização ou qualquer informação sensível</li>
                    <li>Apenas o nome e tamanho do arquivo são exibidos na tela</li>
                    <li>Aceitamos apenas imagens, PDFs e arquivos de texto (máx. 10MB)</li>
                </ul>
                <div class="disclaimer-actions">
                    <button class="btn btn-secondary" onclick="Disclaimer.hide()">Agora não</button>
                    <button class="btn btn-primary" onclick="Disclaimer.accept()">Entendi, vamos lá!</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
};