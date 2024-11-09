import { mount } from '@vue/test-utils'
import NoteForm from '@/components/NoteForm.vue'
import notesService from '@/services/notes'

jest.mock('@/services/notes', () => ({
  createNote: jest.fn(),
  updateNote: jest.fn()
}))

describe('NoteForm.vue', () => {
  let wrapper

  beforeEach(() => {
    jest.clearAllMocks()
    wrapper = mount(NoteForm)
  })

  test('validates required fields', async () => {
    await wrapper.find('form').trigger('submit')

    expect(wrapper.findAll('.invalid-feedback')).toHaveLength(2)
    expect(notesService.createNote).not.toHaveBeenCalled()
  })

  test('creates new note when form is valid', async () => {
    const newNote = {
      title: 'New Note',
      content: 'New Content'
    }
    notesService.createNote.mockResolvedValueOnce({ data: { id: 1, ...newNote } })

    await wrapper.find('input[type="text"]').setValue(newNote.title)
    await wrapper.find('textarea').setValue(newNote.content)
    await wrapper.find('form').trigger('submit')

    expect(notesService.createNote).toHaveBeenCalledWith(newNote)
    expect(wrapper.emitted('submit-success')).toBeTruthy()
  })

  test('handles API errors', async () => {
    notesService.createNote.mockRejectedValueOnce(new Error('API Error'))

    await wrapper.find('input[type="text"]').setValue('Test Note')
    await wrapper.find('textarea').setValue('Test Content')
    await wrapper.find('form').trigger('submit')

    expect(wrapper.find('.alert-danger').exists()).toBe(true)
    expect(wrapper.emitted('submit-error')).toBeTruthy()
  })

  test('resets form fields', async () => {
    const wrapper = mount(NoteForm)

    await wrapper.find('input[type="text"]').setValue('Test Note')
    await wrapper.find('textarea').setValue('Test Content')
    
    // Call resetForm method directly since we're using composition API
    await wrapper.vm.resetForm()

    expect(wrapper.find('input[type="text"]').element.value).toBe('')
    expect(wrapper.find('textarea').element.value).toBe('')
  })

  test('handles edit mode correctly', async () => {
    const existingNote = {
      id: 1,
      title: 'Existing Note',
      content: 'Existing Content'
    }
    
    wrapper = mount(NoteForm, {
      props: { note: existingNote }
    })

    expect(wrapper.find('input[type="text"]').element.value).toBe(existingNote.title)
    expect(wrapper.find('textarea').element.value).toBe(existingNote.content)
  })
})