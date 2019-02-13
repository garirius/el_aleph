%medir volumen
function SPL_dB = measure_spl(myfilename)

%load and calibrate the data
[wav,fs_Hz]=audioread(myfilename);  %load the WAV file

%extract the envelope
smooth_sec = 0.125;  %"FAST" SPL is 1/8th of second.  "SLOW" is 1 second;
smooth_Hz = 1/smooth_sec;
[b,a]=butter(1,smooth_Hz/(fs_Hz/2),'low');  %design a Low-pass filter
wav_env_Pa = sqrt(filter(b,a,wav.^2));  %rectify, by squaring, and low-pass filter

%compute SPL
Pa_ref = 20e-6;  %reference pressure for SPL in Air
SPL_dB = 10.0*log10( (wav_env_Pa ./ Pa_ref).^2 ); % 10*log10 because signal is squared

% %plot results
% figure;
% subplot(2,1,1);
% t_sec = ([1:size(wav)]-1)/fs_Hz;
% plot(t_sec,wav);
% xlabel('Time (sec)');
% ylabel('Pressure (Pa)');
%
% subplot(2,1,2)
% plot(t_sec,SPL_dB);
% xlabel('Time (sec)');
% ylabel('SPL (dB)');
% yl=ylim;ylim(yl(2)+[-80 0]);
end
