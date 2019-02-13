%toma un fragmento de audio y lo fragmenta y reordena para darle una senación extraña
function scramble(filename)
  [wav,fs]=audioread(filename);

  size = 0.1*fs;

  for n=1:20
      pos = round(1 + (length(wav)-size -1)*rand(100,1));
      aux = wav(pos:pos+size);
      wav(pos:pos+size) = [];

      pos = round(1 + (length(wav)-size -1)*rand(100,1));
      wav = [wav(1:pos-1); aux; wav(pos:end)];
  end

  %guardamos el archivo resultante en la misma carpeta que nuestra pista del
  %aleph
  filename = strsplit(filename, '.');
  nu_file = [filename{1} '_scrambled.wav'];
  audiowrite(nu_file,wav,44100);
end
