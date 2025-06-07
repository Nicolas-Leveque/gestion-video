const FormatDAO = require('../../database/dao/FormatDAO');
const { Format, Exemplaire, Film } = require('../../database/models');
const { validateFormat } = require('../../validation');

// Mock the models and validation
jest.mock('../../database/models', () => {
  const mockFormat = {
    create: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn(),
    destroy: jest.fn(),
    save: jest.fn(),
    sequelize: {
      literal: jest.fn().mockReturnValue('LITERAL')
    }
  };
  
  return {
    Format: mockFormat,
    Exemplaire: {},
    Film: {}
  };
});

jest.mock('../../validation', () => ({
  validateFormat: jest.fn(data => Promise.resolve(data))
}));

describe('FormatDAO', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('createFormat', () => {
    it('should validate format data before creating', async () => {
      const formatData = {
        nom: 'Test Format'
      };

      // Mock Format.create to return a format with an id
      Format.create.mockResolvedValue({ id: 1, ...formatData });

      await FormatDAO.createFormat(formatData);

      // Check if validateFormat was called with the correct data
      expect(validateFormat).toHaveBeenCalledWith(formatData);
      
      // Check if Format.create was called with the correct data
      expect(Format.create).toHaveBeenCalledWith({
        nom: formatData.nom
      });
    });
  });

  describe('getFormatById', () => {
    it('should return a format by id', async () => {
      const format = {
        id: 1,
        nom: 'Test Format'
      };

      // Mock Format.findByPk to return a format
      Format.findByPk.mockResolvedValue(format);

      const result = await FormatDAO.getFormatById(1);

      // Check if Format.findByPk was called with the correct id
      expect(Format.findByPk).toHaveBeenCalledWith(1, expect.anything());
      
      // Check if the result is the expected format
      expect(result).toEqual(format);
    });

    it('should include exemplaires if includeExemplaires is true', async () => {
      const format = {
        id: 1,
        nom: 'Test Format',
        exemplaires: []
      };

      // Mock Format.findByPk to return a format with exemplaires
      Format.findByPk.mockResolvedValue(format);

      const result = await FormatDAO.getFormatById(1, true);

      // Check if Format.findByPk was called with the correct options
      expect(Format.findByPk).toHaveBeenCalledWith(1, {
        include: [{ 
          model: Exemplaire, 
          as: 'exemplaires',
          include: [{ model: Film, as: 'film' }]
        }]
      });
      
      // Check if the result is the expected format
      expect(result).toEqual(format);
    });
  });

  describe('getAllFormats', () => {
    it('should return all formats', async () => {
      const formats = [
        { id: 1, nom: 'Format 1' },
        { id: 2, nom: 'Format 2' }
      ];

      // Mock Format.findAll to return formats
      Format.findAll.mockResolvedValue(formats);

      const result = await FormatDAO.getAllFormats();

      // Check if Format.findAll was called with the correct options
      expect(Format.findAll).toHaveBeenCalledWith({
        order: [['nom', 'ASC']]
      });
      
      // Check if the result is the expected formats
      expect(result).toEqual(formats);
    });
  });

  describe('updateFormat', () => {
    it('should validate format data before updating', async () => {
      const formatId = 1;
      const formatData = {
        nom: 'Updated Format'
      };

      // Mock Format.findByPk to return a format
      Format.findByPk.mockResolvedValue({
        id: formatId,
        nom: 'Test Format',
        save: jest.fn()
      });

      await FormatDAO.updateFormat(formatId, formatData);

      // Check if validateFormat was called with the correct data
      expect(validateFormat).toHaveBeenCalledWith(formatData);
      
      // Check if the format was updated with the correct data
      expect(Format.findByPk().nom).toBe(formatData.nom);
      
      // Check if format.save was called
      expect(Format.findByPk().save).toHaveBeenCalled();
    });

    it('should throw an error if format is not found', async () => {
      const formatId = 999;
      const formatData = {
        nom: 'Updated Format'
      };

      // Mock Format.findByPk to return null
      Format.findByPk.mockResolvedValue(null);

      await expect(FormatDAO.updateFormat(formatId, formatData)).rejects.toThrow(`Format with ID ${formatId} not found`);
    });
  });

  describe('deleteFormat', () => {
    it('should delete a format by id', async () => {
      const formatId = 1;

      // Mock Format.findByPk to return a format
      Format.findByPk.mockResolvedValue({
        id: formatId,
        destroy: jest.fn().mockResolvedValue(true)
      });

      const result = await FormatDAO.deleteFormat(formatId);

      // Check if Format.findByPk was called with the correct id
      expect(Format.findByPk).toHaveBeenCalledWith(formatId);
      
      // Check if format.destroy was called
      expect(Format.findByPk().destroy).toHaveBeenCalled();
      
      // Check if the result is true
      expect(result).toBe(true);
    });

    it('should throw an error if format is not found', async () => {
      const formatId = 999;

      // Mock Format.findByPk to return null
      Format.findByPk.mockResolvedValue(null);

      await expect(FormatDAO.deleteFormat(formatId)).rejects.toThrow(`Format with ID ${formatId} not found`);
    });
  });

  describe('getFormatsWithExemplaireCount', () => {
    it('should return formats with exemplaire count', async () => {
      const formats = [
        { id: 1, nom: 'Format 1', get: () => 5 }, // 5 exemplaires
        { id: 2, nom: 'Format 2', get: () => 3 }  // 3 exemplaires
      ];

      // Mock Format.findAll to return formats with exemplaire count
      Format.findAll.mockResolvedValue(formats);

      const result = await FormatDAO.getFormatsWithExemplaireCount();

      // Check if Format.findAll was called with the correct options
      expect(Format.findAll).toHaveBeenCalledWith({
        include: [{ 
          model: Exemplaire, 
          as: 'exemplaires',
          attributes: []
        }],
        attributes: {
          include: [
            [
              'LITERAL',
              'exemplaireCount'
            ]
          ]
        },
        order: [['nom', 'ASC']]
      });
      
      // Check if the result is the expected formats
      expect(result).toEqual(formats);
    });
  });
});