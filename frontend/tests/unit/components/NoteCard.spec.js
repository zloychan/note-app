import { mount } from '@vue/test-utils'
import NoteCard from '@/components/NoteCard.vue'
import notesService from '@/services/notes'

jest.mock('@/services/notes', () => ({
  updateNote: jest.fn(),
  deleteNote: jest.fn()
}))

describe('NoteCard.vue', () => {
  const mockNote = {
    id: 1,
    title: 'Test Note',
    content: 'Test Content',
    updated_at: '2024-01-01T00:00:00.000Z'
  }

  let wrapper

  beforeEach(() => {
    jest.clearAllMocks()
    wrapper = mount(NoteCard, {
      props: { note: mockNote }
    })
  })

  test('renders note information correctly', () => {
    expect(wrapper.find('.card-title').text()).toBe(mockNote.title)
    expect(wrapper.find('.card-text').text()).toBe(mockNote.content)
  })

  test('enters edit mode when edit button is clicked', async () => {
    await wrapper.find('button.btn-outline-primary').trigger('click')
    expect(wrapper.find('form').exists()).toBe(true)
  })

  test('validates form before saving', async () => {
    await wrapper.find('button.btn-outline-primary').trigger('click')
    
    const titleInput = wrapper.find('input[type="text"]')
    await titleInput.setValue('')
    await wrapper.find('form').trigger('submit')

    expect(wrapper.find('.invalid-feedback').exists()).toBe(true)
    expect(notesService.updateNote).not.toHaveBeenCalled()
  })

  test('emits update event when note is saved successfully', async () => {
    const updatedNote = { ...mockNote, title: 'Updated Title' }
    notesService.updateNote.mockResolvedValueOnce(updatedNote)
    
    await wrapper.find('button.btn-outline-primary').trigger('click')
    await wrapper.find('input[type="text"]').setValue('Updated Title')
    await wrapper.find('form').trigger('submit')

    expect(wrapper.emitted('update')).toBeTruthy()
    expect(wrapper.emitted('update')[0][0]).toEqual(updatedNote)
  })

  test('shows confirmation dialog before deleting', async () => {
    const confirmSpy = jest.spyOn(window, 'confirm').mockImplementation(() => true)
    notesService.deleteNote.mockResolvedValueOnce({})

    await wrapper.find('button.btn-outline-danger').trigger('click')

    expect(confirmSpy).toHaveBeenCalled()
    expect(notesService.deleteNote).toHaveBeenCalledWith(mockNote.id)
    expect(wrapper.emitted('delete')).toBeTruthy()

    confirmSpy.mockRestore()
  })
})