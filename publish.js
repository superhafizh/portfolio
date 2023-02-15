import ghpages from 'gh-pages'

let repo = 'github.com:superhafizh/superhafizh.github.io'
let repo_url = `git@${repo}.git`

ghpages.publish('build', {
    branch: 'master',
    repo: repo_url,
    dotfiles: true
}, function(err) {
    if (typeof err !== 'undefined') {
        console.log(err)
        return
    }

    console.log(`Published to ${repo_url}`)
})
