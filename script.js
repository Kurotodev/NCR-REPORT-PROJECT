    // Prefill today's date
    document.getElementById('reportDate').valueAsDate = new Date();

    // Basic client-side validation summary
    document.getElementById('ncrForm').addEventListener('submit', function(e){
      if(!this.checkValidity()){
        e.preventDefault();
        const invalid = [...this.querySelectorAll(':invalid')].map(el=>{
          const lbl = this.querySelector('label[for="'+el.id+'"]');
          return lbl? lbl.textContent.replace(' *','') : el.name || el.id;
        });
        alert('Campos requeridos faltantes:\n- ' + invalid.join('\n- '));
      } else {
        e.preventDefault();
        alert('Formulario válido. Puedes exportar JSON o imprimir para enviar.');
      }
    });

    // Export to JSON
    document.getElementById('exportJsonBtn').addEventListener('click', () => {
      const form = document.getElementById('ncrForm');
      const data = new FormData(form);
      const obj = {};
      for (const [k,v] of data.entries()){
        if (obj[k] !== undefined){
          if (Array.isArray(obj[k])) obj[k].push(v); else obj[k] = [obj[k], v];
        } else {
          obj[k] = v;
        }
      }
      // Files list (names only)
      const ev = document.getElementById('evidence');
      if (ev && ev.files && ev.files.length){
        obj.evidenceFiles = [...ev.files].map(f=>f.name);
      }
      // Fake signatures note
      obj.signatures = {
        quality: document.getElementById('qualityName').value || null,
        engineering: document.getElementById('engName').value || null,
        operations: document.getElementById('opsName').value || null
      };
      const blob = new Blob([JSON.stringify(obj,null,2)], {type:'application/json'});
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = (obj.ncrNumber || 'ncr') + '.json';
      a.click();
      URL.revokeObjectURL(a.href);
    });