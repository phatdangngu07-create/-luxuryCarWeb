document.addEventListener('DOMContentLoaded', () => {
    const videos = [{
            src: '/assets/video/Video1camnang.mp4',
            title: 'Supercar và Hypercar khác nhau ở đâu?'
        },
        {
            src: '/assets/video/Video2camnang.mp4',
            title: 'V8, V10 và V12'
        },
        {
            src: '/assets/video/Video3camnang.mp4',
            title: 'Hybrid và xe điện'
        },
        {
            src: '/assets/video/Video4camnang.mp4',
            title: 'Lực ép xuống và vật liệu carbon'
        },
        {
            src: '/assets/video/Video5camnang.mp4',
            title: 'Công suất và khả năng tăng tốc'
        }
    ];

    const cards = document.querySelectorAll('.knowledge-card');

    cards.forEach((card, index) => {
        const item = videos[index];

        if (!item || card.querySelector('.knowledge-media')) {
            return;
        }

        const wrapper = document.createElement('div');
        wrapper.className = 'knowledge-media';

        const video = document.createElement('video');
        video.className = 'knowledge-video';
        video.src = item.src;
        video.title = item.title;
        video.setAttribute('aria-label', item.title);
        video.controls = true;
        video.autoplay = true;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.preload = 'metadata';

        wrapper.appendChild(video);
        card.insertBefore(wrapper, card.firstChild);

        video.addEventListener('error', () => {
            console.error('Không tải được video:', item.src);
        });
    });
});