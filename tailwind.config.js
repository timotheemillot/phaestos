/** Configuration Tailwind. Pour régénérer tailwind.css après avoir modifié des classes :
 *    npx tailwindcss@3.4.17 -c tailwind.config.js -i tailwind-input.css -o tailwind.css --minify
 */
module.exports = {
    content: ['./index.html', './pages/**/*.html', './*.js'],
    theme: {
        extend: {
            colors: {
                golden: '#d4af37'
            }
        }
    },
    plugins: []
};
