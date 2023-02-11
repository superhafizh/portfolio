<script lang="ts">
    import { goto } from '$app/navigation'
    import HCaptcha from 'svelte-hcaptcha'
    import {ZodError, z} from 'zod'
	import Hero from '../components/hero.svelte';
	import Projects from '../components/projects.svelte';

    type SubmitError = {
        email: string[],
        message: string[],
        token: string[]
    }

    let siteKey = 'dbcdd783-4dd3-4e6d-81f5-43c985cc17c2'
    let captchaSuccess = false
    let captchaToken: string
    let email: string
    let message: string
    let error: SubmitError

    const contactForm = z.object({
        email: z.string({required_error: 'Email is required'})
            .email({message: 'Email format is not correct'}),
        message: z.string({required_error: 'Message is required'}),
        token: z.string({required_error: 'Please solve captcha first.'})
    })

    function handleFailedCaptcha() {
        captchaSuccess = false
    }

    function handleSuccessCaptcha(e:CustomEvent<{token: string}>) {
        captchaSuccess = false
        captchaToken = e.detail.token
    }

    async function sendForm() {
        const result = formValidCheck()
        if (!result.valid && result.result !== null) {
            return
        }

        const response = await fetch('https://eoa7jidyclm6hgu.m.pipedream.net', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(result.result)
        })

        // TODO: show success notification
        window.location.replace('/')
    }

    function formValidCheck(): {valid: boolean, result: {email:string, message: string, token:string} | null} {
        try {
            const result = contactForm.parse({
                email, message, token: captchaToken
            })

            return {valid: true, result}
        } catch(e) {
            if (e instanceof ZodError) {
                const { fieldErrors: errors } = e.flatten()
                error = errors as SubmitError
            }

            return {valid: false, result: null}
        }
    }
</script>

<Hero />

<div class="max-w-4xl mx-auto">
    <Projects />

    <section id="contact-section" class="py-8">
        <h2 class="text-3xl font-bold pb-6 font-display">Contact Me</h2>
        <div class="card shadow-xl bg-base-100">
            <div class="card-body grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="py-2">
                    <p>Happy to chat! I try to respond to everything that isn't spam. (Note: spam includes requests to submit articles, and job opportunities that don't include full details.)</p>
                </div>
                <form class="form-control" on:submit|preventDefault={sendForm}>
                    <label class="label" for="email">
                        <span class="label-text">Email</span>
                    </label>
                    <input type="email" name="email" bind:value={email} class="input input-bordered" />
                    {#if error && error.email}
                        {#each error.email as err}
                            <p class="text-error text-xs">{err}</p>
                        {/each}
                    {/if}
                    <label class="label" for="message">
                        <span class="label-text">Message</span>
                    </label>
                    <textarea name="message" bind:value={message} class="textarea textarea-bordered" rows="3"/>
                    {#if error && error.message}
                        {#each error.message as err}
                            <p class="text-error text-xs">{err}</p>
                        {/each}
                    {/if}
                    <div class="pt-4 px-4">
                        <HCaptcha
                            class="my-4"
                            sitekey={siteKey} 
                            on:success={handleSuccessCaptcha}
                            on:error={handleFailedCaptcha}
                        />
                    </div>
                    {#if error && error.token}
                        {#each error.token as err}
                            <p class="text-error text-xs">{err}</p>
                        {/each}
                    {/if}
                    <button type="submit" class="btn btn-primary mt-8">Send</button>
                </form>
            </div>
        </div>
    </section>
</div>
