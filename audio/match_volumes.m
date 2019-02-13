%crea una pista de audio con el cuenco tibetano cuyo volumen concuerda con la pista del Aleph
function match_volumes(aleph)
tic
%leemos la pista del aleph y medimos el volumen de la pista
vol_aleph = measure_spl(aleph);
max_vol = max(vol_aleph);
vol_aleph = vol_aleph - (max_vol-1);

%para aligerar las cosas, todo lo que quede por debajo de los -40dB
%consideraremos que no existe pr�cticamente
thres = mean(vol_aleph)+std(vol_aleph)/2;
for n=1:length(vol_aleph)
    if vol_aleph(n) > thres
        vol_aleph(n) = 1;
    else
        vol_aleph(n) = 0.01;
    end
end

%hacemos un filtro de media m�vil para que las transiciones sean suaves
vol_aleph = movmean(vol_aleph, 2*44100);

%leemos ahora el archivo de los susurros y tal y lo recortamos para que
%dure lo mismo que la pista del aleph
[bg,~]=audioread('D:\Dropbox\El Aleph\Aleph-BG.wav');
bg = bg(1:length(vol_aleph));

%ajustamos ahora el volumen acorde a la pista del aleph
centro = mean(bg);
for n=1:length(bg)
    dist = bg(n) - centro;
    bg(n) = centro + dist*vol_aleph(n);
end

%guardamos el archivo resultante en la misma carpeta que nuestra pista del
%aleph
aleph = strsplit(aleph, '\\');
nu_file = [];
for n = 1:length(aleph)-1
    nu_file = [nu_file aleph{n} '\'];
end
nu_file = [nu_file 'Aleph-BG-volmatch.wav'];
audiowrite(nu_file,bg,44100);
plot(vol_aleph(1:length))
toc
end
