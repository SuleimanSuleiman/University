const numberOfsection = document.getElementById('lengthOfSection')


numberOfsection.addEventListener('input', (e) => {
    clearAllSection()
    for (let i = 0; i < e.target.value; i++) {
        const theDiv = document.createElement('div')
        theDiv.className = 'a'
        theDiv.innerHTML=`
        <label for="section${i}"> section ${i+1} </label>
        <input type="string" name='section' id='section${i}'/>`
        document.getElementById('section').appendChild(theDiv)
    }
})

function clearAllSection() {
    document.querySelectorAll('.a').forEach((e) => {
        e.remove()
    })
}