/* ---------- filtros de categoria ---------- */
(function(){
  document.querySelectorAll('.catalogo').forEach(function(scope){
    var chips=scope.querySelectorAll('.chip');
    var cards=scope.querySelectorAll('.card');
    var toggle=scope.querySelector('.ver-toggle');
    var moreWrap=scope.querySelector('.mm-more');
    var LIMIT=4, filter='all', expanded=false;
    function apply(){
      var visible=0, matches=0;
      cards.forEach(function(card){
        var cat=(card.getAttribute('data-cat')||'').split(' ');
        var ok=(filter==='all')||cat.indexOf(filter)>-1;
        if(!ok){card.classList.add('hide');return;}
        matches++;
        if(!expanded && visible>=LIMIT){card.classList.add('hide');}
        else{card.classList.remove('hide');visible++;}
      });
      var needBtn=matches>LIMIT;
      if(moreWrap)moreWrap.style.display=needBtn?'':'none';
      if(needBtn && toggle){
        toggle.textContent=expanded?'Ver menos':('Ver todos os '+matches+(scope.id==='multimidia'?' modelos':' produtos'));
        toggle.setAttribute('aria-expanded',expanded?'true':'false');
      }
    }
    chips.forEach(function(c){
      c.addEventListener('click',function(){
        chips.forEach(function(x){x.classList.remove('active');x.setAttribute('aria-pressed','false');});
        c.classList.add('active');c.setAttribute('aria-pressed','true');
        filter=c.getAttribute('data-filter');expanded=false;apply();
      });
    });
    if(toggle){
      toggle.addEventListener('click',function(){
        expanded=!expanded;apply();
        if(!expanded){scope.scrollIntoView({behavior:'smooth',block:'start'});}
      });
    }
    apply();
  });
})();

/* ---------- modais de projetos e produtos ---------- */
(function(){
  /* =========================================================
     PROJETOS FINALIZADOS — GALERIA POR CATEGORIA
     Para adicionar fotos: coloque os arquivos em
     assets/img/ e liste os caminhos em "fotos".
     A 1a foto da lista aparece grande (topo); as demais
     ficam na grade de 2 colunas. Recomendado: 5 fotos.
     ========================================================= */
  var PROJETOS = {
    som: {
      titulo: "Som automotivo",
      sub: "Instalações de som feitas pela Junior Som — alto-falantes, módulos e caixas com acabamento profissional.",
      wa: "https://wa.me/5548984116458?text=Ol%C3%A1%21%20Vi%20os%20projetos%20de%20som%20automotivo%20e%20quero%20um%20or%C3%A7amento.",
      fotos: [
        "assets/img/projetos-1.jpg",
        "assets/img/projetos-2.jpg",
        "assets/img/projetos-3.jpg",
        "youtube:crs1xJeCUSA",
        "youtube:KL0xNTmH2Hg",
        "youtube:jcvKC8lH7a8",
        "youtube:J0KeaT3ht2Q"
      ]
    },
    multimidia: {
      titulo: "Central multimídia",
      sub: "Multimídias instaladas mantendo câmera, sensores e comandos de volante 100% funcionais.",
      wa: "https://wa.me/5548984116458?text=Ol%C3%A1%21%20Vi%20os%20projetos%20de%20central%20multim%C3%ADdia%20e%20quero%20um%20or%C3%A7amento.",
      fotos: [
        "assets/img/multimidia-1.jpg",
        "assets/img/multimidia-2.jpg",
        "assets/img/multimidia-3.jpg",
        "assets/img/multimidia-4.jpg",
        "assets/img/multimidia-5.jpg"
      ]
    },
    farol: {
      titulo: "Faróis de LED",
      sub: "Faróis e lâmpadas de LED instalados com foco regulado no padrão — mais luz e segurança à noite.",
      wa: "https://wa.me/5548984116458?text=Ol%C3%A1%21%20Vi%20os%20projetos%20de%20far%C3%B3is%20de%20LED%20e%20quero%20um%20or%C3%A7amento.",
      fotos: [
        "assets/img/farol-1.jpg",
        "assets/img/farol-2.jpg",
        "assets/img/farol-3.jpg",
        "assets/img/farol-4.jpg",
        "assets/img/farol-5.jpg"
      ]
    },
    rastreador: {
      titulo: "Rastreadores",
      sub: "Rastreadores instalados com monitoramento 24h, alertas e bloqueio contra roubos e furtos.",
      wa: "https://wa.me/5548984116458?text=Ol%C3%A1%21%20Vi%20os%20projetos%20de%20rastreador%20e%20quero%20um%20or%C3%A7amento.",
      fotos: [
        // "assets/img/rastreador-1.jpg",
        // "assets/img/rastreador-2.jpg",
        // "assets/img/rastreador-3.jpg",
        // "assets/img/rastreador-4.jpg",
        // "assets/img/rastreador-5.jpg"
      ]
    }
  };

  var overlay = document.getElementById('projetos-modal');
  if(!overlay) return;
  var elTitle = document.getElementById('proj-title');
  var elSub   = document.getElementById('proj-sub');
  var elGal   = document.getElementById('proj-galeria');
  var elWpp   = document.getElementById('proj-wpp');
  var btnClose= overlay.querySelector('.modal-close');
  var lastFocus = null, closeTimer = null;

  var lb    = document.getElementById('pg-lightbox');
  var lbImg = document.getElementById('pg-lightbox-img');
  var lbClose = lb ? lb.querySelector('.pg-lb-close') : null;

  function tile(src, alt, isPlaceholder){
    var d = document.createElement('div');
    var ytId = src && /^youtube:(.+)/.exec(src);
    ytId = ytId ? ytId[1] : null;
    d.className = 'pg-item' + (isPlaceholder || !src ? '' : ytId ? ' pg-video' : ' tem-foto');
    if(isPlaceholder || !src){
      d.innerHTML = '<div class="pg-ph"><span class="pg-icon" aria-hidden="true">📷</span><span>Foto em breve</span></div>';
    } else if(ytId) {
      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube.com/embed/' + ytId + '?rel=0';
      iframe.title = alt || 'Vídeo do projeto';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0;';
      d.appendChild(iframe);
    } else {
      var im = document.createElement('img');
      im.src = src; im.alt = alt; im.loading = 'lazy';
      im.addEventListener('error', function(){
        d.className = 'pg-item';
        d.innerHTML = '<div class="pg-ph"><span class="pg-icon" aria-hidden="true">📷</span><span>Foto em breve</span></div>';
      });
      d.appendChild(im);
      d.addEventListener('click', function(){ if(d.classList.contains('tem-foto')) abrirLightbox(src, alt); });
    }
    return d;
  }

  function render(cat){
    elGal.innerHTML = '';
    var fotos = (cat.fotos || []).filter(function(f){ return f && f.trim(); });
    if(fotos.length){
      fotos.forEach(function(src, i){
        elGal.appendChild(tile(src, cat.titulo + ' — projeto ' + (i+1), false));
      });
      // preenche slots restantes até 5 com placeholder
      for(var i=fotos.length; i<5; i++){ elGal.appendChild(tile(null, '', true)); }
    } else {
      // sem fotos ainda: mostra 5 molduras no layout (1 grande + 4)
      for(var i=0;i<5;i++){ elGal.appendChild(tile(null, '', true)); }
    }
  }

  function abrir(key){
    var cat = PROJETOS[key]; if(!cat) return;
    lastFocus = document.activeElement;
    elTitle.textContent = cat.titulo;
    elSub.textContent = cat.sub || '';
    elWpp.href = cat.wa || '#';
    render(cat);
    if(closeTimer){clearTimeout(closeTimer); closeTimer=null;}
    overlay.hidden = false; overlay.setAttribute('aria-hidden','false');
    document.body.classList.add('modal-lock');
    requestAnimationFrame(function(){ overlay.classList.add('open'); });
    btnClose.focus();
  }

  function fechar(){
    overlay.classList.remove('open'); overlay.setAttribute('aria-hidden','true');
    document.body.classList.remove('modal-lock');
    closeTimer = setTimeout(function(){ overlay.hidden = true; }, 220);
    if(lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function abrirLightbox(src, alt){
    if(!lb) return;
    lbImg.src = src; lbImg.alt = alt || '';
    lb.classList.add('open'); lb.setAttribute('aria-hidden','false');
  }
  function fecharLightbox(){
    if(!lb) return;
    lb.classList.remove('open'); lb.setAttribute('aria-hidden','true');
    lbImg.src = '';
  }

  document.querySelectorAll('.inst-item[data-projetos]').forEach(function(card){
    card.addEventListener('click', function(){ abrir(card.getAttribute('data-projetos')); });
  });

  btnClose.addEventListener('click', fechar);
  overlay.addEventListener('click', function(e){ if(e.target === overlay) fechar(); });

  if(lb){
    lbClose.addEventListener('click', fecharLightbox);
    lb.addEventListener('click', function(e){ if(e.target === lb) fecharLightbox(); });
  }

  document.addEventListener('keydown', function(e){
    if(e.key !== 'Escape') return;
    if(lb && lb.classList.contains('open')){ fecharLightbox(); return; }
    if(overlay.classList.contains('open')) fechar();
  });
  document.querySelectorAll('[data-projetos-btn]').forEach(function(btn){
    btn.addEventListener('click', function(){ abrir(btn.getAttribute('data-projetos-btn')); });
  });
})();

(function(){
  var PRODUTOS = {
    rs915: {
      badge: "Modelo usado na loja",
      titulo: 'Central Multimídia RS-915BR Prime 9"',
      desc: 'Android 12 com CarPlay e Android Auto sem fio, tela IPS 9", 2GB + 32GB, Quad Core, GPS, Wi-Fi, câmera de ré e comando de volante.',
      wa: "https://wa.me/5548984116458?text=Ol%C3%A1%21%20Quero%20um%20or%C3%A7amento%20da%20central%20multim%C3%ADdia%20Roadstar%20RS-915BR%20Prime%209%22.",
      imagens: [],
      specs: [
        ["Sistema","Android"],
        ["Processador","Quad Core 1.5 GHz"],
        ["Memória RAM","2 GB"],
        ["Memória Flash","32 GB"],
        ["Tela",'Vidro Full Touch IPS 9" capacitiva'],
        ["Painel","Fixo, com botões touch e iluminação RGB"],
        ["Rádio","FM com memória para 18 estações"],
        ["Conexões","Bluetooth, Wi-Fi e GPS (acompanha antena)"],
        ["Espelhamento","Apple CarPlay e Android Auto sem fio (Wi-Fi) ou por Bluetooth. Espelha Android (versão 5+) e iPhone"],
        ["GPS","Integrado, com navegação on-line (Wi-Fi) e off-line (mapas baixáveis)"],
        ["Entradas traseiras","2 vídeo auxiliar, 2 RCA (áudio), 1 câmera de ré, 2 USB (USB e USB-C) e microfone externo (acompanha)"],
        ["Saídas","2 RCA (áudio) e 2 RCA (vídeo)"],
        ["Comando de volante","Sim (alguns modelos de carro podem exigir interface)"],
        ["Potência","4 canais de 50 W RMS"]
      ],
      obs: "Recomendamos que a instalação seja feita por profissional ou loja especializada."
    },
    rs918: {"badge": "Vidro 2.5D", "badgeTipo": "azul", "titulo": "Central Multimídia RS-918BR Pro Line 9\"", "desc": "Central Multimídia Roadstar 9 Polegadas RS-918BR Pro Line com Bluetooth, CarPlay, Android Auto, Apps, Android, Wi-Fi, GPS e 4x50W.", "wa": "https://wa.me/5548984116458?text=Ol%C3%A1%21%20Quero%20um%20or%C3%A7amento%20da%20central%20multim%C3%ADdia%20Roadstar%20RS-918BR%20Pro%20Line%209%22.", "imagens": [], "specs": [["Sistema", "Android"], ["Processador", "Quad Core TS7 1.3 GHz"], ["Memória RAM", "2 GB"], ["Memória Flash", "32 GB"], ["Espelhamento", "Apple CarPlay e Android Auto (com fio e sem fio)"], ["Aplicativos", "YouTube, Netflix, Spotify, Waze, Maps e Play Store (baixa apps no aparelho)"], ["Tela", "Vidro Full Touch 9\" capacitiva IPS + 2.5D"], ["Painel", "Fixo, com botões touch e iluminação RGB"], ["Rádio", "FM com memória para 18 estações"], ["Conexões", "Bluetooth, Wi-Fi e GPS integrado (acompanha antena)"], ["Entradas traseiras", "2 vídeo auxiliar, 2 RCA (áudio), 2 USB (USB e USB-C) e microfone externo (acompanha)"], ["Saídas", "2 RCA (áudio), 2 RCA (vídeo) e saída para subwoofer"], ["Comando de volante", "Sim (alguns modelos de carro podem exigir interface)"], ["Câmera de ré", "Entrada dedicada"], ["Potência", "4 canais de 50 W RMS"]], "conteudo": ["01 Multimídia Android RS-918BR Pro Line", "01 Microfone externo", "01 Antena GPS", "02 fios USB (com conectores para ligar direto na multimídia)", "Chicotes de ligação", "Manual"], "obs": "Recomendamos que a instalação seja feita por profissional ou loja especializada."},
    rs920: {"badge": "Premium", "badgeTipo": "azul", "titulo": "Central Multimídia RS-920BR Pro Line 9\" QLED", "desc": "Central multimídia Roadstar RS-920BR Pro Line: Android Octa Core 2.5 GHz, 4GB RAM + 64GB, tela QLED 9\" IPS + 2.5D, 4G integrado, espelhamento sem fio e suporte a câmera 360º.", "wa": "https://wa.me/5548984116458?text=Ol%C3%A1%21%20Quero%20um%20or%C3%A7amento%20da%20central%20multim%C3%ADdia%20Roadstar%20RS-920BR%20Pro%20Line%209%22%20QLED%204G.", "imagens": [], "specs": [["Sistema", "Android"], ["Processador", "Octa Core 2.5 GHz"], ["Memória RAM", "4 GB"], ["Memória Flash", "64 GB"], ["Tela", "QLED 9\" IPS + 2.5D capacitiva Full Touch"], ["Painel", "Fixo, com botões touch e iluminação RGB"], ["Rádio", "FM com memória para 18 estações"], ["4G integrado", "Entrada para SIM Card 4G"], ["Conexões", "Bluetooth, Wi-Fi e GPS (acompanha antena)"], ["Espelhamento", "Apple CarPlay e Android Auto sem fio (Wi-Fi) ou por Bluetooth"], ["Entradas traseiras", "2 vídeo auxiliar, 2 RCA (áudio), 1 câmera de ré, 2 USB (USB e USB-C) e microfone externo (acompanha)"], ["Saídas", "2 RCA (áudio) e 2 RCA (vídeo)"], ["Câmera de ré", "Entrada CVBS ou AHD, com suporte a câmera 360º"], ["Comando de volante", "Sim (alguns modelos de carro podem exigir interface)"], ["Potência", "4 canais de 50 W RMS"]], "conteudo": ["01 Multimídia Android RS-920BR Pro Line", "01 Microfone externo", "01 Antena GPS", "02 fios USB (com conectores para ligar direto na multimídia)", "01 fio para chip de celular (SIM Card 4G)", "Chicotes de ligação", "Manual"], "obs": "Recomendamos que a instalação seja feita por profissional ou loja especializada."},
    rs925: {"badge": "Topo de linha", "badgeTipo": "ciano", "titulo": "Central Multimídia RS-925BR iA Pro Line 9\" QLED", "desc": "Topo de linha com inteligência artificial: Android, 6GB RAM + 128GB, tela QLED 9\" IPS + 2.5D, DSP de áudio, Bluetooth 5.4, Wi-Fi dual band (2.5G + 5G), 4G integrado e controle para câmeras DVR.", "wa": "https://wa.me/5548984116458?text=Ol%C3%A1%21%20Quero%20um%20or%C3%A7amento%20da%20central%20multim%C3%ADdia%20Roadstar%20RS-925BR%20iA%20Pro%20Line%206GB%20128GB.", "imagens": [], "specs": [["Sistema", "Android"], ["Processador", "Octa Core 1.6 GHz"], ["Memória RAM", "6 GB"], ["Memória Flash", "128 GB"], ["Tela", "QLED 9\" IPS + 2.5D capacitiva Full Touch"], ["Painel", "Fixo, com botões touch e iluminação RGB"], ["Rádio", "AM/FM com RDS"], ["4G integrado", "Entrada para SIM Card 4G"], ["Equalizador", "DSP"], ["Conexões", "Bluetooth 5.4, Wi-Fi 2.5G + 5G e GPS (acompanha antena)"], ["Entradas traseiras", "2 vídeo auxiliar, 2 RCA (áudio), 1 câmera de ré, 2 USB (USB e USB-C) e microfone externo (acompanha)"], ["Saídas", "2 RCA (áudio) e 2 RCA (vídeo)"], ["Câmera de ré", "Entrada CVBS ou AHD"], ["DVR", "Controle para câmeras DVR"], ["Comando de volante", "Sim (alguns modelos de carro podem exigir interface)"], ["Potência", "4 canais de 50 W RMS"]], "conteudo": ["01 Multimídia Android RS-925BR iA Pro Line", "01 Microfone externo", "01 Antena GPS", "02 fios USB (com conectores para ligar direto na multimídia)", "01 fio para chip de celular (SIM Card 4G)", "Chicotes de ligação", "Manual e certificado de garantia"], "obs": "Recomendamos que a instalação seja feita por profissional ou loja especializada."},
    rs910: {"badge": "", "titulo": "Central Multimídia RS-910BR Prime 9\"", "desc": "Central multimídia Roadstar RS-910BR Prime: Android com espelhamento sem fio (Wi-Fi), tela full touch 9\" capacitiva, 2GB + 32GB, GPS com antena, câmera de ré e 4x50W RMS.", "wa": "https://wa.me/5548984116458?text=Ol%C3%A1%21%20Quero%20um%20or%C3%A7amento%20da%20central%20multim%C3%ADdia%20Roadstar%20RS-910BR%20Prime%209%22.", "imagens": [], "specs": [["Sistema", "Android"], ["Processador", "Quad Core 1.3 GHz"], ["Memória RAM", "2 GB"], ["Memória Flash", "32 GB"], ["Painel", "Fixo, com botões touch e iluminação RGB"], ["Tela", "Full Touch 9\" capacitiva"], ["Rádio", "FM com memória para 18 estações"], ["Conexões", "Bluetooth, Wi-Fi e GPS (acompanha antena)"], ["Espelhamento", "Android e iOS sem fio via Wi-Fi (Android 5+ e iPhone até a versão 13)"], ["Entradas traseiras", "2 vídeo auxiliar, 1 câmera de ré, 2 USB e microfone externo (acompanha)"], ["Saídas", "2 RCA (áudio) e 2 RCA (vídeo)"], ["Comando de volante", "Sim (alguns modelos de carro podem exigir interface)"], ["Potência", "4 canais de 50 W RMS"]], "conteudo": ["01 Central Multimídia 9\" RS-910BR Prime", "01 Microfone externo", "01 Antena GPS (off-line)", "Demais cabos para instalação", "01 Manual do usuário"], "obs": "Recomendamos que a instalação seja feita por profissional ou loja especializada."},
    rs909: {"badge": "", "titulo": "Central Multimídia 9 Polegadas Android Rs909br Plus Roadstar", "desc": "Central multimídia Roadstar RS-909BR Plus: Android 10.1 de entrada, tela full touch 9\" capacitiva, 1GB + 16GB, espelhamento sem fio, GPS integrado (on-line e off-line) e câmera de ré.", "wa": "https://wa.me/5548984116458?text=Ol%C3%A1%21%20Quero%20um%20or%C3%A7amento%20da%20central%20multim%C3%ADdia%20Roadstar%20RS-909BR%20Plus%209%22.", "imagens": [], "specs": [["Sistema", "Android 10.1"], ["Processador", "Quad Core 1.3 GHz"], ["Memória RAM", "1 GB"], ["Memória ROM", "16 GB"], ["Painel", "Fixo, com botões touch em 7 cores de iluminação"], ["Tela", "Full Touch 9\" capacitiva"], ["Rádio", "FM com memória para 18 estações"], ["Conexões", "Bluetooth, Wi-Fi e GPS (acompanha antena)"], ["Espelhamento", "Android e iOS sem fio via Wi-Fi (Android 5+ e iPhone até a versão 12)"], ["GPS", "Integrado, com navegação on-line (Wi-Fi) e off-line (mapas baixáveis)"], ["Entradas traseiras", "2 vídeo auxiliar, 1 câmera de ré, 2 USB e microfone externo (acompanha)"], ["Saídas", "2 RCA (áudio) e 2 RCA (vídeo)"], ["Comando de volante", "Sim (alguns modelos de carro podem exigir interface)"], ["Potência", "4 canais de 50 W RMS"]], "conteudo": ["01 Central Multimídia RS-909BR Plus", "01 Antena GPS", "Chicotes para instalação"], "obs": "Recomendamos que a instalação seja feita por profissional ou loja especializada."},
    rs9200: {"badge": "CarPlay sem fio", "badgeTipo": "azul", "titulo": "Multimídia Mp5 9' Roadstar RS-9200BR Pro Line Carplay Sem Fio", "desc": "Multimídia MP5 Roadstar RS-9200BR Pro Line: CarPlay e Android Auto (sem fio e com cabo), MirrorCast, tela IPS 9\" full touch, Bluetooth 5.0 e 4x50W RMS.", "wa": "https://wa.me/5548984116458?text=Ol%C3%A1%21%20Quero%20um%20or%C3%A7amento%20da%20central%20multim%C3%ADdia%20Roadstar%20RS-9200BR%20Pro%20Line%20CarPlay%20sem%20fio.", "imagens": [], "specs": [["Sistema", "MP5"], ["Tela", "IPS Full Touch 9\" capacitiva de alta definição"], ["Painel", "Fixo, com botões em 7 cores de iluminação"], ["Rádio", "FM com memória para 18 estações"], ["Espelhamento", "MirrorCast, Apple CarPlay e Android Auto (sem fio e com cabo)"], ["Bluetooth", "5.0 (chamadas e streaming de áudio)"], ["Comando de volante", "Sim (pode exigir interface conforme o modelo do carro)"], ["Entradas traseiras", "2 USB (USB e USB-C), auxiliar, vídeo auxiliar, câmera de ré e microfone externo"], ["Saídas", "2 RCA (áudio) e 2 RCA (vídeo)"], ["Conector", "Padrão 16 vias"], ["Potência", "4 canais de 50 W RMS"]], "conteudo": ["01 Multimídia MP5 RS-9200BR Pro Line", "01 Microfone externo", "02 Extensões USB", "Chicotes de ligação", "Manual do usuário"], "obs": "Recomendamos que a instalação seja feita por profissional ou loja especializada."},
    rs908: {"badge": "CarPlay", "badgeTipo": "azul", "titulo": "Multimídia Mp5 RS-908BR - Prime Apple Carplay Tela 9 Polegadas", "desc": "Multimídia MP5 Roadstar RS-908BR Prime: Apple CarPlay e espelhamento via cabo USB (Android e iOS), tela full touch 9\" capacitiva 1080p, Bluetooth e câmera de ré.", "wa": "https://wa.me/5548984116458?text=Ol%C3%A1%21%20Quero%20um%20or%C3%A7amento%20da%20central%20multim%C3%ADdia%20Roadstar%20RS-908BR%20Prime%209%22%20Slim.", "imagens": [], "specs": [["Sistema", "MP5"], ["Tela", "Full Touch 9\" capacitiva (resolução 1080)"], ["Painel", "Ajustável, com botões em 7 cores de iluminação"], ["Espelhamento", "Apple CarPlay; espelha Android e iOS (todas as versões) via cabo USB"], ["Bluetooth", "Chamadas e reprodução de áudio"], ["Comando de volante", "Sim (sistema resistivo; compatibilidade pode variar)"], ["Entradas traseiras", "2 USB (USB e USB-C), 1 câmera de ré, 1 vídeo auxiliar, 1 auxiliar e microfone externo"], ["Saídas", "2 RCA (áudio)"], ["Conector", "ISO"], ["Rádio", "FM com memória para 18 estações"], ["Potência", "4 x 50 W RMS"], ["Dimensões (produto)", "13 cm (alt.) x 22,5 cm (comp.)"]], "obs": "Recomendamos que a instalação seja feita por profissional ou loja especializada."},
    rs7009: {"badge": "CarPlay sem fio", "badgeTipo": "azul", "titulo": "Central Multimídia RS-7009BR 9\"", "desc": "Multimídia Roadstar RS-7009BR: CarPlay e Android Auto sem fio, tela IPS 9\" capacitiva, Bluetooth A2DP, equalizador, 6 saídas RCA para amplificação e câmera de ré AHD 720P.", "wa": "https://wa.me/5548984116458?text=Ol%C3%A1%21%20Quero%20um%20or%C3%A7amento%20da%20central%20multim%C3%ADdia%20Roadstar%20RS-7009BR%209%22.", "imagens": [], "specs": [["Sistema", "MP5"], ["Tela", "IPS capacitiva 9\""], ["Espelhamento", "Apple CarPlay e Android Auto sem fio (iOS e Android)"], ["Bluetooth", "Com A2DP e download de agenda telefônica"], ["Rádio", "FM integrado"], ["Equalizador", "Ajustes de graves, agudos e estilos musicais"], ["Câmera de ré", "Entrada AHD 720P"], ["Saídas de áudio", "6 RCA para amplificação"], ["Áudio/vídeo", "2 saídas de áudio, 2 de vídeo e saída para monitor de encosto"], ["Entradas", "USB, USB-C (carregamento) e auxiliar (AUX)"], ["Comando de volante", "Compatível (interface não acompanha; adquirir à parte se necessário)"], ["Conector", "ISO para instalação"], ["Potência", "4 x 50 W"]], "conteudo": ["01 Multimídia Roadstar RS-7009BR", "Chicote de instalação", "Cabo extensor USB", "Microfone externo", "Manual do usuário"], "obs": "Recomendamos que a instalação seja feita por profissional ou loja especializada."},
    rs1018: {"badge": "Tela 10\"", "badgeTipo": "azul", "titulo": "Central Multimídia RS-1018BR Pro Line 10\"", "desc": "Central multimídia Roadstar RS-1018BR Pro Line: tela grande vidro IPS 10\" + 2.5D, Android, 2GB + 32GB, Quad Core TS7, GPS com antena, câmera de ré e 4x50W RMS.", "wa": "https://wa.me/5548984116458?text=Ol%C3%A1%21%20Quero%20um%20or%C3%A7amento%20da%20central%20multim%C3%ADdia%20Roadstar%20RS-1018BR%20Pro%20Line%2010%22.", "imagens": [], "specs": [["Sistema", "Android"], ["Processador", "Quad Core TS7 1.3 GHz"], ["Memória RAM", "2 GB"], ["Memória Flash", "32 GB"], ["Painel", "Fixo, com botões touch e iluminação RGB"], ["Tela", "Vidro Full Touch 10\" capacitiva IPS + 2.5D"], ["Rádio", "FM com memória para 18 estações"], ["Conexões", "Bluetooth, Wi-Fi e GPS (acompanha antena)"], ["Entradas traseiras", "2 vídeo auxiliar, 2 RCA (áudio), 1 câmera de ré, 2 USB (USB e USB-C) e microfone externo (acompanha)"], ["Saídas", "2 RCA (áudio)"], ["Comando de volante", "Sim (alguns modelos de carro podem exigir interface)"], ["Potência", "4 canais de 50 W RMS"]], "conteudo": ["01 Multimídia Android RS-1018BR Pro Line", "01 Microfone externo", "01 Antena GPS", "02 fios USB (com conectores para ligar direto na multimídia)", "Chicotes de ligação"], "obs": "Recomendamos que a instalação seja feita por profissional ou loja especializada."},
    rs815: {"badge": "Espelhamento sem fio", "badgeTipo": "azul", "titulo": "Central Multimídia RS-815BR Prime 7\"", "desc": "Central multimídia Roadstar RS-815BR Prime 7\": Apple CarPlay e Android Auto sem fio, Android, tela vidro full touch IPS 7\" capacitiva, 2GB + 32GB, GPS com antena e câmera de ré.", "wa": "https://wa.me/5548984116458?text=Ol%C3%A1%21%20Quero%20um%20or%C3%A7amento%20da%20central%20multim%C3%ADdia%20Roadstar%20RS-815BR%20Prime%207%22.", "imagens": [], "specs": [["Sistema", "Android"], ["Processador", "Quad Core 1.3 GHz"], ["Memória RAM", "2 GB"], ["Memória Flash", "32 GB"], ["Painel", "Fixo, com botões touch e iluminação RGB"], ["Tela", "Vidro Full Touch IPS 7\" capacitiva"], ["Rádio", "FM com memória para 18 estações"], ["Conexões", "Bluetooth, Wi-Fi e GPS (acompanha antena)"], ["Espelhamento", "Apple CarPlay e Android Auto sem fio"], ["Entradas traseiras", "2 vídeo auxiliar, 2 RCA (áudio), 1 câmera de ré, 2 USB (USB e USB-C) e microfone externo (acompanha)"], ["Saídas", "2 RCA (áudio) e 2 RCA (vídeo)"], ["Comando de volante", "Sim (alguns modelos de carro podem exigir interface)"], ["Potência", "4 canais de 50 W RMS"]], "conteudo": ["01 Multimídia 7\" RS-815BR Prime", "Chicotes de instalação", "Manual do usuário"], "obs": "Recomendamos que a instalação seja feita por profissional ou loja especializada."}
  };

  var overlay = document.getElementById('produto-modal');
  if(!overlay) return;
  var elImg   = document.getElementById('modal-img');
  var elThumbs= document.getElementById('modal-thumbs');
  var elBadge = document.getElementById('modal-badge');
  var elTitle = document.getElementById('modal-title');
  var elDesc  = document.getElementById('modal-desc');
  var elSpecs = document.getElementById('modal-specs');
  var elWpp   = document.getElementById('modal-wpp');
  var btnClose= overlay.querySelector('.modal-close');
  var lastFocus = null, closeTimer = null;

  function setThumbs(imgs){
    elThumbs.innerHTML = '';
    if(imgs.length < 2){ elThumbs.style.display='none'; return; }
    elThumbs.style.display='flex';
    imgs.forEach(function(src,i){
      var b = document.createElement('button');
      b.type='button'; b.className='modal-thumb'+(i===0?' active':'');
      b.setAttribute('aria-label','Foto '+(i+1));
      var im = document.createElement('img'); im.src=src; im.alt=''; b.appendChild(im);
      b.addEventListener('click',function(){
        elImg.src=src;
        elThumbs.querySelectorAll('.modal-thumb').forEach(function(x){x.classList.remove('active');});
        b.classList.add('active');
      });
      elThumbs.appendChild(b);
    });
  }

  function abrir(id, cardImg){
    var p = PRODUTOS[id]; if(!p) return;
    lastFocus = document.activeElement;
    var imgs = (p.imagens && p.imagens.length) ? p.imagens.slice() : [];
    if(cardImg) imgs.unshift(cardImg);
    if(!imgs.length) imgs = [''];
    elImg.src = imgs[0]; elImg.alt = p.titulo;
    setThumbs(imgs);
    elBadge.textContent = p.badge || ''; elBadge.style.display = p.badge ? '' : 'none';
    elBadge.className = 'modal-badge' + (p.badgeTipo && p.badgeTipo !== 'verde' ? ' ' + p.badgeTipo : '');
    elTitle.textContent = p.titulo;
    elDesc.textContent = p.desc || '';
    // specs
    elSpecs.innerHTML = '';
    (p.specs||[]).forEach(function(row){
      var wrap = document.createElement('div');
      var dt = document.createElement('dt'); dt.textContent = row[0];
      var dd = document.createElement('dd'); dd.textContent = row[1];
      wrap.appendChild(dt); wrap.appendChild(dd); elSpecs.appendChild(wrap);
    });
    // conteudo da embalagem
    var boxWrap = document.getElementById('modal-conteudo');
    var boxList = document.getElementById('modal-conteudo-list');
    if(boxWrap && boxList){
      boxList.innerHTML='';
      if(p.conteudo && p.conteudo.length){
        p.conteudo.forEach(function(it){ var li=document.createElement('li'); li.textContent=it; boxList.appendChild(li); });
        boxWrap.hidden=false;
      } else { boxWrap.hidden=true; }
    }
    var elObs = document.getElementById('modal-obs');
    if(elObs){ if(p.obs){ elObs.textContent=p.obs; elObs.hidden=false; } else { elObs.hidden=true; } }
    elWpp.href = p.wa || '#';
    // abrir
    if(closeTimer){clearTimeout(closeTimer); closeTimer=null;}
    overlay.hidden = false; overlay.setAttribute('aria-hidden','false');
    document.body.classList.add('modal-lock');
    requestAnimationFrame(function(){ overlay.classList.add('open'); });
    btnClose.focus();
  }

  function fechar(){
    overlay.classList.remove('open'); overlay.setAttribute('aria-hidden','true');
    document.body.classList.remove('modal-lock');
    closeTimer = setTimeout(function(){ overlay.hidden = true; }, 220);
    if(lastFocus && lastFocus.focus) lastFocus.focus();
  }

  document.querySelectorAll('.card[data-product]').forEach(function(card){
    card.addEventListener('click', function(e){
      if(e.target.closest('.btn-mini')) return; // botao de orcamento age normalmente
      var img = card.querySelector('.foto img');
      abrir(card.getAttribute('data-product'), img ? img.getAttribute('src') : null);
    });
  });
  btnClose.addEventListener('click', fechar);
  overlay.addEventListener('click', function(e){ if(e.target === overlay) fechar(); });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && overlay.classList.contains('open')) fechar(); });
})();
